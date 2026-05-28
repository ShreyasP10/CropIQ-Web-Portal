export default function PrivacyPolicyPage() {
  return (
    <section className="mx-auto w-full max-w-4xl px-4 py-16">
      <h1 className="text-4xl font-bold">Privacy Policy</h1>
      <div className="prose prose-neutral mt-6 dark:prose-invert">
        <p>
          CropIQ collects minimum required usage analytics and support data to improve product quality.
          No Firebase Storage is used in this web architecture. APK delivery is via secure external release URLs.
        </p>
        <h2>Data Collection</h2>
        <p>
          We only store information you voluntarily provide (feedback, support requests) and anonymous usage
          statistics (app version, detection counts) via Firebase Firestore and Realtime Database.
          No personally identifiable crop images leave your device unless you choose to share them in the
          community feed.
        </p>
        <h2>Third-Party Services</h2>
        <p>
          The website uses Google Firebase for authentication and database. Please refer to Google’s privacy
          policy for their data handling. APK files are hosted on GitHub Releases.
        </p>
        <h2>Contact</h2>
        <p>
          For privacy concerns, reach out via the Support page or email us at support@cropiq.app.
        </p>
      </div>
    </section>
  );
}