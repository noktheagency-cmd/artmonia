import { contact } from "@/data/site";
import { getPublishedContent } from "@/lib/site-content";
import styles from "./WhatsAppButton.module.css";

export default async function WhatsAppButton() {
  const content = await getPublishedContent();
  const savedContact = content.contact;
  const phone = savedContact && typeof savedContact === "object" && !Array.isArray(savedContact)
    && typeof savedContact.phone === "string" ? savedContact.phone : contact.phone;
  const digits = phone.replace(/\D/g, "") || contact.phone.replace(/\D/g, "");

  return (
    <a className={styles.button} href={`https://wa.me/${digits}`} target="_blank" rel="noopener noreferrer"
      aria-label="WhatsApp ilə əlaqə saxla">
      <span className={styles.label} aria-hidden="true">Bizə yazın</span>
      <svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
        <path d="M20.52 3.48A11.9 11.9 0 0 0 12.05 0C5.47 0 .11 5.35.11 11.94c0 2.1.55 4.15 1.6 5.96L0 24l6.26-1.64a11.9 11.9 0 0 0 5.79 1.48h.01c6.58 0 11.94-5.36 11.94-11.94 0-3.19-1.24-6.19-3.48-8.42ZM12.06 21.82a9.9 9.9 0 0 1-5.05-1.38l-.36-.21-3.72.98.99-3.63-.23-.37a9.86 9.86 0 0 1-1.51-5.27c0-5.47 4.45-9.92 9.88-9.92a9.85 9.85 0 0 1 7.02 2.91 9.84 9.84 0 0 1 2.9 7.02c0 5.47-4.45 9.87-9.92 9.87Zm5.44-7.4c-.3-.15-1.77-.87-2.05-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.64.07-.3-.15-1.26-.46-2.39-1.46-.88-.78-1.47-1.74-1.64-2.04-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.49s1.07 2.89 1.22 3.09c.15.2 2.1 3.2 5.09 4.49.71.31 1.27.49 1.7.63.71.23 1.36.2 1.88.12.57-.08 1.77-.72 2.02-1.42.25-.7.25-1.3.17-1.42-.07-.13-.27-.2-.57-.35Z" />
      </svg>
    </a>
  );
}
