import { Center, Heading, Image, ScrollView, Text, VStack } from '@gluestack-ui/themed'
import BackgroundImg from '@assets/background.png'
import Logo from '@assets/logo.svg'
import { Input } from '@components/Input'
import { Button } from '@components/Button'

export function SignUp() {
  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>

    <VStack flex={1} bg="$orange900">
      <Image
        w="$full"
        h={624}
        source={BackgroundImg}
        defaultSource={BackgroundImg}
        alt="Pessoas treinando"
        position="absolute"
      />
       <VStack flex={1} px="$10" pb="$16">
        <Center my="$24">
          <Logo />

          <Text color="$orange100" fontSize="$sm">
            Treine sua mente e seu corpo
          </Text>
        </Center>
        <Center flex={1} gap="$2">
          <Heading color="$orange100">Crie sua conta</Heading>
          <Input placeholder="Nome" />
          <Input
            placeholder="E-mail"
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <Input placeholder="Senha" secureTextEntry />


          <Button title="Criar e acessar"/>
        </Center>

   
          <Button mt="$12" title="Voltar para o login" variant="outline" />
      </VStack>
    </VStack>
    </ScrollView>

  )
}