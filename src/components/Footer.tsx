export default function Footer() {
    return (
        <footer className="mt-8 p-4
      bg-white text-siamBrown
      dark:bg-[var(--color-card-dark)] dark:text-siamBrown-dark
      border-t border-gray-200 dark:border-gray-600
      text-center text-sm">
            <p className="font-medium">
                © {new Date().getFullYear()} Catiopia. All rights reserved.
            </p>
        </footer>
    );
}
