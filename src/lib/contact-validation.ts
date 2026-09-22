export function validContact(input: { fullName: string; phone: string; email: string | null; goal: string | null; interest: string | null; level: string | null }) {
  const digits = input.phone.replace(/\D/g, "");
  return input.fullName.length >= 2 && input.fullName.length <= 120
    && /^[+\d\s().-]+$/.test(input.phone) && input.phone.length <= 40
    && digits.length >= 7 && digits.length <= 15 && !/^(\d)\1+$/.test(digits)
    && (!input.email || (input.email.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.email)))
    && (input.goal?.length ?? 0) <= 2000 && (input.interest?.length ?? 0) <= 200 && (input.level?.length ?? 0) <= 100;
}
