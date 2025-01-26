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

import { useState } from "react";
import { ToastMessage } from "@components/ToastMessage";

export function Profile() {
  const [userPhoto, setUserPhoto] = useState(
    "https://github.com/drlazinho.png"
  );

  const toast = useToast()

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
                action='error'
                title='Essa imagem é muito grande. Escolha uma de até 5MB.'
                onClose={() => toast.close(id)}
              />
            )
          })
        }

        setUserPhoto(photoSelected.assets[0].uri);
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <VStack flex={1}>
      <ToastMessage
        id="1"
        title="Mensagem de exemplo"
        description="asdasdakjsd asdajksdbasjdhasd"
        action="success"
        onClose={() => {}}
      />

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
          <Input placeholder="Nome" bg="$trueGray600" />
          <Input
            value="lazbonfim@hotmail.com"
            placeholder="Nome"
            bg="$trueGray600"
            isReadOnly
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
          <Input placeholder="Senha antiga" bg="$trueGray600" secureTextEntry />
          <Input placeholder="Nova senha" bg="$trueGray600" secureTextEntry />
          <Input
            placeholder="Confirme a nova senha"
            bg="$trueGray600"
            secureTextEntry
          />
          <Button title="Atualizar" />
        </Center>
      </ScrollView>
    </VStack>
  );
}
