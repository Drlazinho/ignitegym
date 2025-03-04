import { Heading, HStack, Icon, Text, VStack } from "@gluestack-ui/themed";
import { UserPhoto } from "./UserPhoto";
import { LogOut } from "lucide-react-native";
import { useAuth } from "@hooks/useAuth";
import defaulUserPhotoImg from "@assets/userPhotoDefault.png";
import { TouchableOpacity } from "react-native";
import { api } from '../service/api'

export function HomeHeader() {
  const { user, signOut } = useAuth();

  return (
    <HStack
      bg="$trueGray600"
      pt="$16"
      pb="$5"
      px="$8"
      alignItems="center"
      gap="$4"
    >
      <UserPhoto
        source={
          user.avatar
            ? { uri: `${api.defaults.baseURL}/avatar/${user.avatar}` }
            : defaulUserPhotoImg
        }
        w="$16"
        h="$16"
        alt="Imagem do usuário"
      />
      <VStack flex={1}>
        <Text color="$orange100" fontSize="$sm">
          Olá
        </Text>
        <Heading color="$orange100" fontSize="$md">
          {user.name}
        </Heading>
      </VStack>

      <TouchableOpacity onPress={signOut}>
        <Icon as={LogOut} color="$orange200" size="xl" />
      </TouchableOpacity>
    </HStack>
  );
}
