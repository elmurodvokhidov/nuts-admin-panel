import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSeparator,
    InputOTPSlot,
} from "@/components/ui/input-otp"
import { useNavigate } from "react-router-dom"
import { PASSCODE } from "@/constants"
import { decryptKey, encryptKey } from "@/lib/utils"
import { useEffect } from "react"

const FormSchema = z.object({
    pin: z.string().min(6, {
        message: "Parolingiz 6 ta belgidan iborat bo'lishi kerak.",
    }),
})

export default function LockScreen() {
    const navigate = useNavigate();
    const encryptedKey = typeof window !== 'undefined' ? window.localStorage.getItem('accessKey') : null;

    useEffect(() => {
        const accessKey = encryptedKey && decryptKey(encryptedKey);
        if (accessKey === PASSCODE) {
            navigate("/");
        }
    }, [encryptedKey])

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            pin: "",
        },
    })

    function onSubmit(data: z.infer<typeof FormSchema>) {
        const accessKey = data.pin;
        if (accessKey === PASSCODE) {
            const encryptedKey = encryptKey(accessKey);
            localStorage.setItem('accessKey', encryptedKey);
            return navigate("/");
        }
        form.setError("pin", { message: "Parol xato, tekshirib qaytadan urinib ko'ring." });
    }

    return (
        <div className="w-full h-screen flex items-center justify-center gap-28">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                        control={form.control}
                        name="pin"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-black text-xl">Xush kelibsiz!</FormLabel>
                                <FormControl>
                                    <InputOTP maxLength={6} {...field}>
                                        <InputOTPGroup>
                                            <InputOTPSlot index={0} className="text-5xl size-16" />
                                            <InputOTPSlot index={1} className="text-5xl size-16" />
                                            <InputOTPSlot index={2} className="text-5xl size-16" />
                                        </InputOTPGroup>
                                        <InputOTPSeparator />
                                        <InputOTPGroup>
                                            <InputOTPSlot index={3} className="text-5xl size-16" />
                                            <InputOTPSlot index={4} className="text-5xl size-16" />
                                            <InputOTPSlot index={5} className="text-5xl size-16" />
                                        </InputOTPGroup>
                                    </InputOTP>
                                </FormControl>
                                <FormDescription className="text-base">
                                    Platformaga kirish uchun parolni kiriting.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <Button type="submit" className="text-base">Tasdiqlash</Button>
                </form>
            </Form>
        </div>
    )
}