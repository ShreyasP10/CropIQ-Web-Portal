"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { motion } from "framer-motion";
import {
  submitSupportAction
}
from "@/app/action/submit-support";

const schema = z.object({
  type: z.enum(["Bug Report", "Suggestion", "Feedback", "Support Message"]),
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email"),
  message: z.string().min(8, "Message must be at least 8 characters"),
  website: z.string().max(0).optional(), // honeypot
});

type FormValues = z.infer<typeof schema>;

export default function SupportPage() {
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      type: "Support Message",
      name: "",
      email: "",
      message: "",
      website: "",
    },
  });

// inside SupportPage component
const onSubmit = async (values: FormValues) => {
  try {
    await submitSupportAction(values); // server action
    toast.success("Message sent! We'll get back to you soon.");
    form.reset();
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Submission failed. Please try again.";
    toast.error(message);
  }
};

  return (
    <section className="mx-auto w-full max-w-3xl px-4 py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-4xl font-bold">Support & Suggestions</h1>
        <p className="mt-3 text-muted-foreground">
          Report a bug, suggest a feature, or just say hello.
        </p>
      </motion.div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="mt-8 space-y-6">
          {/* Honeypot – hidden from real users */}
          <div className="absolute opacity-0 pointer-events-none" aria-hidden="true">
            <Input
              {...form.register("website")}
              tabIndex={-1}
              autoComplete="off"
              placeholder="Leave blank"
            />
          </div>

          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Type</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Bug Report">Bug Report</SelectItem>
                    <SelectItem value="Suggestion">Suggestion</SelectItem>
                    <SelectItem value="Feedback">Feedback</SelectItem>
                    <SelectItem value="Support Message">Support Message</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="John Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="john@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Message</FormLabel>
                <FormControl>
                  <Textarea rows={5} placeholder="Describe your issue or suggestion..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full sm:w-auto">
            Submit
          </Button>
        </form>
      </Form>
    </section>
  );
}