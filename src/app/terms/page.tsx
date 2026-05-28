export default function TermsPage() {
  return (
    <section className="mx-auto w-full max-w-4xl px-4 py-16">
      <h1 className="text-4xl font-bold">Terms & Conditions</h1>
      <div className="prose prose-neutral mt-6 dark:prose-invert">
        <p>
          By using CropIQ and downloading APK releases, you agree to responsible usage and these platform policies.
          CropIQ is provided as-is while continuously improving model quality and recommendations.
        </p>
        <h2>Usage License</h2>
        <p>
          You are granted a non-exclusive, non-transferable license to use the CropIQ application on your Android device
          for personal or educational purposes. Redistribution of the APK without permission is prohibited.
        </p>
        <h2>Limitation of Liability</h2>
        <p>
          CropIQ is an AI-assisted tool; it does not replace professional agricultural advice. The creators are not liable
          for any crop loss or damage resulting from the use of the application.
        </p>
        <h2>Updates</h2>
        <p>
          Terms may be updated periodically. Continued use of the app signifies acceptance of the latest terms.
        </p>
      </div>
    </section>
  );
}