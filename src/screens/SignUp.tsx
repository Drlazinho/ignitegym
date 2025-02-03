import {
  Center,
  Heading,
  Image,
  ScrollView,
  Text,
  VStack,
} from "@gluestack-ui/themed";
import BackgroundImg from "@assets/background.png";
import Logo from "@assets/logo.svg";
import { Input } from "@components/Input";
import { Button } from "@components/Button";
import { useNavigation } from "@react-navigation/native";
import { AuthNavigatorRoutesProps } from "@routes/auth.routes";
import { Controller, useForm } from "react-hook-form";

type FormDataProps = {
  name: string;
  email: string;
  password: string;
  password_confirm: string;
};

export function SignUp() {
  const navigation = useNavigation<AuthNavigatorRoutesProps>();

  function handleNewAccount() {
    navigation.navigate("signIn");
  }

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormDataProps>();

  function handleSignUp({
    name,
    email,
    password,
    password_confirm,
  }: FormDataProps) {}

  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      showsVerticalScrollIndicator={false}
    >
      <VStack flex={1}>
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

            <Controller
              control={control}
              name="name"
              rules={{
                required: "Informe o nome",
              }}
              render={({ field: { onChange, value } }) => (
                <Input
                  placeholder="Nome"
                  onChangeText={onChange}
                  value={value}
                />
              )}
            />

            <Controller
              control={control}
              name="email"
              rules={{
                required: "Informe o email",
                pattern: {
                  value:/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'E-mail inválido'
                }
              }}
              render={({ field: { onChange, value } }) => (
                <Input
                  placeholder="E-mail"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  onChangeText={onChange}
                  value={value}
                />
              )}
            />

            <Text color="$white">{errors.email?.message}</Text>

            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, value } }) => (
                <Input
                  placeholder="Senha"
                  secureTextEntry
                  onChangeText={onChange}
                  value={value}
                />
              )}
            />

            <Button
              title="Criar e acessar"
              onPress={handleSubmit(handleSignUp)}
            />
          </Center>

          <Button
            mt="$12"
            title="Voltar para o login"
            variant="outline"
            onPress={handleNewAccount}
          />
        </VStack>
      </VStack>
    </ScrollView>
  );
}
