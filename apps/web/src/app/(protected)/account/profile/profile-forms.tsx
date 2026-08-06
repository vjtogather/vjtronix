"use client";

import { useEffect, useState, useTransition } from "react";
import { useForm, type UseFormRegisterReturn } from "react-hook-form";
import { Camera, KeyRound, LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";

import { changePassword, updateProfile } from "@/app/(protected)/account/profile/actions";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { changePasswordSchema, phoneSchema } from "@/lib/validations/profile";

type ProfileFormValues = { avatar?: FileList; name: string; phone: string };
type PasswordFormValues = { confirmPassword: string; currentPassword: string; newPassword: string };

interface ProfileFormsProps {
  hasPassword: boolean;
  user: { email: string | null; image: string | null; name: string | null; phone: string | null };
}

function getInitials(name: string | null, email: string | null) {
  return (name || email || "VJ")
    .split(/\s+|@/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

export function ProfileForms({ hasPassword, user }: ProfileFormsProps) {
  const router = useRouter();
  const [isProfilePending, startProfileTransition] = useTransition();
  const [isPasswordPending, startPasswordTransition] = useTransition();
  const [profileMessage, setProfileMessage] = useState<string>();
  const [passwordMessage, setPasswordMessage] = useState<string>();
  const [previewUrl, setPreviewUrl] = useState<string | null>(user.image);
  const profileForm = useForm<ProfileFormValues>({ defaultValues: { name: user.name || "", phone: user.phone || "" } });
  const passwordForm = useForm<PasswordFormValues>({ defaultValues: { confirmPassword: "", currentPassword: "", newPassword: "" } });

  useEffect(() => () => {
    if (previewUrl?.startsWith("blob:")) URL.revokeObjectURL(previewUrl);
  }, [previewUrl]);

  function applyFieldErrors(
    errors: Record<string, string[]> | undefined,
    form: typeof profileForm | typeof passwordForm,
  ) {
    Object.entries(errors || {}).forEach(([field, messages]) => {
      form.setError(field as never, { message: messages[0] });
    });
  }

  async function submitProfile(values: ProfileFormValues) {
    setProfileMessage(undefined);
    profileForm.clearErrors();
    const avatar = values.avatar?.item(0);

    if (avatar && (!["image/jpeg", "image/png", "image/webp"].includes(avatar.type) || avatar.size > 600 * 1024)) {
      profileForm.setError("avatar", { message: "Choose a PNG, JPEG, or WebP image smaller than 600 KB." });
      return;
    }

    if (values.phone && !phoneSchema.safeParse(values.phone).success) {
      profileForm.setError("phone", { message: "Enter a valid phone number with country code." });
      return;
    }

    let avatarDataUrl: string | undefined;
    try {
      avatarDataUrl = avatar ? await readFileAsDataUrl(avatar) : undefined;
    } catch {
      setProfileMessage("Unable to read the selected image. Please try again.");
      return;
    }
    startProfileTransition(async () => {
      const result = await updateProfile({ name: values.name, phone: values.phone, avatarDataUrl });
      applyFieldErrors(result.fieldErrors, profileForm);
      setProfileMessage(result.error || result.success);
      if (result.success) router.refresh();
    });
  }

  function submitPassword(values: PasswordFormValues) {
    setPasswordMessage(undefined);
    passwordForm.clearErrors();
    const validation = changePasswordSchema.safeParse(values);

    if (!validation.success) {
      applyFieldErrors(validation.error.flatten().fieldErrors, passwordForm);
      return;
    }

    startPasswordTransition(async () => {
      const result = await changePassword(values);
      applyFieldErrors(result.fieldErrors, passwordForm);
      setPasswordMessage(result.error || result.success);
      if (result.success) passwordForm.reset();
    });
  }

  return (
    <div className="grid gap-6 xl:grid-cols-2">
      <Card>
        <CardHeader><CardTitle>Personal information</CardTitle><CardDescription>Update the details shown across your MicroHelp account.</CardDescription></CardHeader>
        <CardContent>
          <form className="space-y-5" onSubmit={profileForm.handleSubmit(submitProfile)}>
            <div className="flex items-center gap-4">
              <Avatar className="size-16 text-xl" size="lg">
                {previewUrl ? <AvatarImage alt="Profile avatar preview" src={previewUrl} /> : null}
                <AvatarFallback className="bg-sky-300/15 text-sky-100">{getInitials(user.name, user.email)}</AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-white/15 px-3 py-2 text-sm font-medium text-slate-200 transition hover:bg-white/[0.06] focus-within:outline focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-sky-300">
                  <Camera className="size-4" aria-hidden="true" /> Upload avatar
                  <input accept="image/jpeg,image/png,image/webp" className="sr-only" type="file" {...profileForm.register("avatar", { onChange: (event) => { const file = event.target.files?.[0]; if (file) setPreviewUrl(URL.createObjectURL(file)); } })} />
                </label>
                <p className="mt-2 text-xs text-slate-500">PNG, JPEG, or WebP. Maximum 600 KB.</p>
                <FieldError message={profileForm.formState.errors.avatar?.message} />
              </div>
            </div>
            <Field error={profileForm.formState.errors.name?.message} label="Name" name="name" registration={profileForm.register("name")} type="text" autoComplete="name" />
            <Field error={profileForm.formState.errors.phone?.message} label="Phone number" name="phone" registration={profileForm.register("phone")} type="tel" autoComplete="tel" hint="Optional. Include your country code, for example +919876543210." />
            <Field label="Email address" name="email" type="email" value={user.email || "Not available"} disabled />
            <Message message={profileMessage} success={profileMessage === "Profile updated."} />
            <Button disabled={isProfilePending} type="submit">{isProfilePending ? <><LoaderCircle className="animate-spin" /> Saving…</> : "Save changes"}</Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Security</CardTitle><CardDescription>{hasPassword ? "Confirm your current password before choosing a new one." : "Create a password to enable email and password sign-in."}</CardDescription></CardHeader>
        <CardContent>
          <form className="space-y-5" onSubmit={passwordForm.handleSubmit(submitPassword)}>
            {hasPassword ? <Field error={passwordForm.formState.errors.currentPassword?.message} label="Current password" name="currentPassword" registration={passwordForm.register("currentPassword")} type="password" autoComplete="current-password" /> : null}
            <Field error={passwordForm.formState.errors.newPassword?.message} label="New password" name="newPassword" registration={passwordForm.register("newPassword")} type="password" autoComplete="new-password" hint="Use at least 8 characters." />
            <Field error={passwordForm.formState.errors.confirmPassword?.message} label="Confirm new password" name="confirmPassword" registration={passwordForm.register("confirmPassword")} type="password" autoComplete="new-password" />
            <Message message={passwordMessage} success={Boolean(passwordMessage && !passwordMessage.includes("incorrect"))} />
            <Button disabled={isPasswordPending} type="submit"><KeyRound aria-hidden="true" />{isPasswordPending ? "Saving…" : hasPassword ? "Change password" : "Create password"}</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

function Field({ autoComplete, disabled, error, hint, label, name, registration, type, value }: { autoComplete?: string; disabled?: boolean; error?: string; hint?: string; label: string; name: string; registration?: UseFormRegisterReturn; type: string; value?: string }) {
  return <div className="grid gap-2"><label className="text-sm font-medium text-slate-200" htmlFor={name}>{label}</label><Input aria-invalid={Boolean(error)} autoComplete={autoComplete} disabled={disabled} id={name} type={type} value={value} {...registration} /><FieldError message={error} />{hint ? <p className="text-xs text-slate-500">{hint}</p> : null}</div>;
}

function FieldError({ message }: { message?: string }) { return message ? <p className="text-sm text-rose-200" role="alert">{message}</p> : null; }
function Message({ message, success }: { message?: string; success: boolean }) { return message ? <p className={success ? "text-sm text-emerald-200" : "text-sm text-rose-200"} role="status">{message}</p> : null; }

function readFileAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => { const reader = new FileReader(); reader.onerror = () => reject(new Error("Unable to read the selected image.")); reader.onload = () => resolve(String(reader.result)); reader.readAsDataURL(file); });
}
