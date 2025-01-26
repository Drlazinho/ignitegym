import { Input as GluestackInput, InputField } from "@gluestack-ui/themed";
import { ComponentProps } from "react";

type Props = ComponentProps<typeof InputField> & {
  isReadOnly?: boolean
};

export function Input({ isReadOnly = false, ...props }: Props) {
  return (
    <GluestackInput
      h="$16"
      borderWidth="$0"
      borderRadius="$md"
      $focus={{ borderWidth: 1, borderColor: "$green500" }}
      isReadOnly={isReadOnly}
      opacity={isReadOnly ? 0.5 : 1}
    >
      <InputField
        bg="$trueGray400"
        px="$4"
        color="$white"
        fontFamily="$body"
        placeholderTextColor="$trueGray300"
        {...props}
      />
    </GluestackInput>
  );
}
