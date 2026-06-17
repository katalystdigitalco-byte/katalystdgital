// WhatsApp floating chat button. Update PHONE to the real business number (E.164, no +).
const PHONE = "919999999999";
const MESSAGE = "Hi Katalyst — I'd like to chat about a project.";

export function WhatsAppButton() {
  const href = `https://wa.me/${PHONE}?text=${encodeURIComponent(MESSAGE)}`;
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      data-cursor="link"
      className="fixed bottom-5 right-5 z-[90] grid h-14 w-14 place-items-center rounded-full bg-[#25D366] text-white shadow-2xl shadow-[#25D366]/30 transition-transform hover:scale-105 md:bottom-8 md:right-8"
    >
      <svg viewBox="0 0 32 32" className="h-7 w-7" fill="currentColor" aria-hidden="true">
        <path d="M19.11 17.31c-.27-.14-1.6-.79-1.85-.88-.25-.09-.43-.14-.61.14-.18.27-.7.88-.86 1.06-.16.18-.32.2-.59.07-.27-.14-1.14-.42-2.17-1.34-.8-.71-1.34-1.59-1.5-1.86-.16-.27-.02-.42.12-.55.12-.12.27-.32.41-.48.14-.16.18-.27.27-.45.09-.18.05-.34-.02-.48-.07-.14-.61-1.47-.84-2.02-.22-.53-.45-.46-.61-.47l-.52-.01c-.18 0-.48.07-.73.34-.25.27-.96.94-.96 2.29 0 1.35.98 2.66 1.12 2.84.14.18 1.94 2.96 4.7 4.15.66.28 1.17.45 1.57.58.66.21 1.26.18 1.74.11.53-.08 1.6-.65 1.83-1.28.23-.63.23-1.17.16-1.28-.07-.11-.25-.18-.52-.32zM16.03 4C9.4 4 4 9.4 4 16.02c0 2.12.55 4.19 1.61 6.02L4 28l6.13-1.6a12 12 0 0 0 5.9 1.55h.01C22.66 27.95 28 22.55 28 15.94 28 9.32 22.65 4 16.03 4zm0 21.92h-.01a10 10 0 0 1-5.09-1.39l-.36-.22-3.64.95.97-3.55-.24-.37a10 10 0 0 1-1.53-5.32C6.13 10.49 10.57 6.05 16.04 6.05c2.65 0 5.15 1.04 7.03 2.92a9.86 9.86 0 0 1 2.91 7.03c0 5.46-4.45 9.92-9.95 9.92z"/>
      </svg>
    </a>
  );
}
