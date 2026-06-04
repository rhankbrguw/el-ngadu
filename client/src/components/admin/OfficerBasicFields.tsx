import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { PETUGAS_DIALOG_STRINGS } from "@/lib/constants/admin";
import type { Control } from "react-hook-form";
import type { PetugasPayload } from "@/lib/validators";
import { APP_MESSAGES } from "@/lib/constants/messages";


export function OfficerBasicFields({ control }: { control: Control<PetugasPayload> }) {
 return (
 <>
 <FormField
 control={control}
 name="nama_petugas"
 render={({ field }) => (
 <FormItem>
 <FormLabel>{PETUGAS_DIALOG_STRINGS.LABEL_NAMA}</FormLabel>
 <FormControl>
 <Input placeholder={PETUGAS_DIALOG_STRINGS.PLACEHOLDER_NAMA} {...field} />
 </FormControl>
 <FormMessage />
 </FormItem>
 )}
 />
 <FormField
 control={control}
 name="username"
 render={({ field }) => (
 <FormItem>
 <FormLabel>{PETUGAS_DIALOG_STRINGS.LABEL_USERNAME}</FormLabel>
 <FormControl>
 <Input placeholder={PETUGAS_DIALOG_STRINGS.PLACEHOLDER_USERNAME} {...field} />
 </FormControl>
 <FormMessage />
 </FormItem>
 )}
 />
 <FormField
 control={control}
 name="email"
 render={({ field }) => (
 <FormItem>
 <FormLabel>{APP_MESSAGES.AUTH.EMAIL_LABEL}</FormLabel>
 <FormControl>
 <Input type="email" placeholder="contoh@gmail.com" {...field} />
 </FormControl>
 <FormMessage />
 </FormItem>
 )}
 />
 </>
 );
}
