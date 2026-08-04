"use server";

import "server-only";

import { cookies } from "next/headers";
import {
  getFirestore,
  FieldValue,
} from "firebase-admin/firestore";

import { sanitizeInput } from "@/lib/utils/sanitize";
import { checkRateLimit } from "@/lib/rate-limit";
import type { SupportFormPayload } from "@/types";

const RATE_LIMIT_SECONDS = 60;
// Max submissions per IP per minute — stops bots flooding the inbox
const IP_RATE_LIMIT = 5;

export async function submitSupportAction(
  payload: SupportFormPayload
) {
  try {

    if (!(await checkRateLimit(IP_RATE_LIMIT))) {
      throw new Error(
        "Too many requests. Please try again later."
      );
    }

    const cookieStore =
      await cookies();

    // Honeypot check
    // Bots fill hidden fields
    if (
      payload.website &&
      payload.website
        .trim()
        .length > 0
    ) {
      return {
        success: true,
      };
    }

    // Rate limit
    const lastSubmission =
      cookieStore.get(
        "last-support-submit"
      )?.value;

    if (lastSubmission) {

      const lastTime =
        parseInt(
          lastSubmission,
          10
        );

      const diff =
        Date.now()
        - lastTime;

      if (
        diff <
        RATE_LIMIT_SECONDS
        * 1000
      ) {
        throw new Error(
          "Please wait before sending another message."
        );
      }
    }

    // Server-side validation
    if (
      !payload.type ||
      ![
        "Bug Report",
        "Suggestion",
        "Feedback",
        "Support Message",
      ].includes(
        payload.type
      )
    ) {
      throw new Error(
        "Invalid support type."
      );
    }

    if (
      !payload.name ||
      payload.name
        .trim()
        .length < 2
    ) {
      throw new Error(
        "Invalid name."
      );
    }

    if (
      !payload.email ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/
        .test(
          payload.email
        )
    ) {
      throw new Error(
        "Invalid email."
      );
    }

    if (
      !payload.message ||
      payload.message
        .trim()
        .length < 8
    ) {
      throw new Error(
        "Message is too short."
      );
    }

    // Firestore Admin SDK
    const firestore =
      getFirestore();

    await firestore
      .collection(
        "user-feedback"
      )
      .add({
        name:
          sanitizeInput(
            payload.name
          ),

        email:
          sanitizeInput(
            payload.email
              .toLowerCase()
          ),

        subject:
          sanitizeInput(
            payload.subject ??
            ""
          ),

        message:
          sanitizeInput(
            payload.message
          ),

        type:
          payload.type,

        status:
          "Unread",

        createdAt:
          FieldValue
            .serverTimestamp(),
      });

    // Set cooldown cookie
    cookieStore.set(
      "last-support-submit",
      String(
        Date.now()
      ),
      {
        httpOnly: true,

        secure:
          process.env
            .NODE_ENV
          ===
          "production",

        sameSite:
          "strict",

        path: "/",

        maxAge:
          RATE_LIMIT_SECONDS,
      }
    );

    return {
      success: true,
    };

  } catch (error) {

    console.error(
      "Support submit error:",
      error
    );

    throw error;
  }
}