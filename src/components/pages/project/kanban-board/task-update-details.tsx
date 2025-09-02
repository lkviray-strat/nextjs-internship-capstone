import { Editor } from "@/src/components/blocks/editor-00/editor";
import { RequiredLabel } from "@/src/components/required-label";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/src/components/ui/form";
import { Input } from "@/src/components/ui/input";
import type { UpdateTaskRequestInput } from "@/src/types";
import type { SerializedEditorState } from "lexical";
import type { useForm } from "react-hook-form";

type TaskUpdateDetailsProps = {
  control: ReturnType<typeof useForm<UpdateTaskRequestInput>>["control"];
};

export function TaskUpdateDetails({ control }: TaskUpdateDetailsProps) {
  return (
    <>
      <FormField
        control={control}
        name="title"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              <RequiredLabel>Task Name</RequiredLabel>
            </FormLabel>
            <FormControl>
              <Input
                placeholder="Enter task name  (e.g. Design Landing Page)"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Description</FormLabel>
            <FormControl>
              <Editor
                editorSerializedState={field.value as SerializedEditorState}
                onSerializedChange={field.onChange}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}
