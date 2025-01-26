import { Heading, HStack, Icon, Text, VStack } from '@gluestack-ui/themed'
import { UserPhoto } from './UserPhoto'
import { LogOut } from 'lucide-react-native'

export function HomeHeader() {
  return (
    <HStack bg="$trueGray600" pt="$16" pb="$5" px="$8" alignItems="center" gap='$4'>
      <UserPhoto source={{ uri: 'https://github.com/drlazinho.png'}} w='$16' h='$16' alt='Imagem do usuário' />
      <VStack flex={1}>
        <Text color="$orange100" fontSize="$sm">
          Olá
        </Text>
        <Heading color="$orange100" fontSize="$md">
          Lazaro Bonfim
        </Heading>
      </VStack>

      <Icon as={LogOut} color='$orange200' size='xl' />
    </HStack>
  )
}