import { Button } from "@components/Button";
import { Input } from "@components/Input";
import { ScreenHeader } from "@components/ScreenHeader";
import { UserPhoto } from "@components/UserPhoto";
import {
  Center,
  Heading,
  ScrollView,
  Text,
  useToast,
  VStack,
} from "@gluestack-ui/themed";
import { Alert, TouchableOpacity } from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import { Controller, useForm } from "react-hook-form";
import { useAuth } from "@hooks/useAuth";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import { useState } from "react";
import { ToastMessage } from "@components/ToastMessage";

type FormDataProps = {
  name: string;
  email: string;
  password: string;
  old_password: string;
  confirm_password: string;
};

const profileSchema = yup.object({
  name: yup
    .string()
    .required('Informe o nome'),
  password: yup
    .string()
    .min(6, 'A senha deve ter pelo menos 6 dígitos.')
    .nullable()
    .transform((value) => !!value ? value : null),
  confirm_password: yup
    .string()
    .nullable()
    .transform((value) => !!value ? value : null)
    .oneOf([yup.ref('password'), null], 'A confirmação de senha não confere.')
    .when('password', {
      is: (Field: any) => Field, 
      then: yup
        .string()
        .nullable()
        .required('Informe a confirmação da senha.')
        .transform((value) => !!value ? value : null)
    }),
})

export function Profile() {
  const [userPhoto, setUserPhoto] = useState(
    "https://github.com/drlazinho.png"
  );
  const { user } = useAuth();

  const { control, handleSubmit, formState: { errors } } = useForm<FormDataProps>({ 
    defaultValues: { 
      name: user.name,
      email: user.email
    },
    resolver: yupResolver(profileSchema) 
  });

  const toast = useToast();

  async function handleProfileUpdate(data: FormDataProps) {
    console.log(data);
  }

  async function handleUserPhotoSelect() {
    try {
      const photoSelected = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        quality: 1,
        aspect: [4, 4],
        allowsEditing: true,
      });

      if (photoSelected.canceled) {
        return;
      }

      const photoUri = photoSelected.assets[0].uri;

      if (photoUri) {
        const photoInfo = (await FileSystem.getInfoAsync(photoUri)) as {
          size: number;
        };

        if (photoInfo.size && photoInfo.size / 1024 / 1024 > 5) {
          return toast.show({
            render: ({ id }) => (
              <ToastMessage
                id={id}
                action="error"
                title="Essa imagem é muito grande. Escolha uma de até 5MB."
                onClose={() => toast.close(id)}
              />
            ),
          });
        }

        setUserPhoto(photoSelected.assets[0].uri);
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <VStack flex={1}>
      {/* <ToastMessage
        id="1"
        title="Mensagem de exemplo"
        description="asdasdakjsd asdajksdbasjdhasd"
        action="success"
        onClose={() => {}}
      /> */}

      <ScreenHeader title="Perfil" />

      <ScrollView
        contentContainerStyle={{ paddingBottom: 36, paddingInline: 20 }}
      >
        <Center mt="$6" px="$10">
          <UserPhoto
            source={{ uri: userPhoto }}
            size="xl"
            alt="Imagem do usuário"
          />

          <TouchableOpacity onPress={handleUserPhotoSelect}>
            <Text
              color="$green500"
              fontFamily="$heading"
              fontSize="$md"
              mt="$2"
              mb="$8"
            >
              Alterar Foto
            </Text>
          </TouchableOpacity>
        </Center>

        <Center w="$full" gap="$4">
          <Controller
            control={control}
            name="name"
            render={({ field: { value, onChange } }) => (
              <Input
                bg="$trueGray600"
                placeholder="Nome"
                onChangeText={onChange}
                value={value}
              />
            )}
          />
          <Controller
            control={control}
            name="email"
            render={({ field: { value, onChange } }) => (
              <Input
                bg="$trueGray600"
                placeholder="E-mail"
                isReadOnly
                onChangeText={onChange}
                value={value}
              />
            )}
          />
        </Center>
        <Heading
          alignSelf="flex-start"
          fontFamily="$heading"
          color="$trueGray200"
          fontSize="$md"
          mt="$12"
          mb="$2"
        >
          Alterar senha
        </Heading>
        <Center w="$full" gap="$4">
          <Controller
            control={control}
            name="old_password"
            render={({ field: { onChange } }) => (
              <Input
                bg="$trueGray600"
                placeholder="Senha antiga"
                secureTextEntry
                onChangeText={onChange}
              />
            )}
          />
          <Controller
            control={control}
            name="password"
            render={({ field: { onChange } }) => (
              <Input
                bg="$trueGray600"
                placeholder="Nova senha"
                secureTextEntry
                onChangeText={onChange}
              />
            )}
          />
          <Controller
            control={control}
            name="confirm_password"
            render={({ field: { onChange } }) => (
              <Input
                bg="$trueGray600"
                placeholder="Confirme a nova senha"
                secureTextEntry
                onChangeText={onChange}
              />
            )}
          />{" "}
          <Button
            title="Atualizar"
            onPress={handleSubmit(handleProfileUpdate)}
          />
        </Center>
      </ScrollView>
    </VStack>
  );
}
