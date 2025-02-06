import {
  Center,
  Heading,
  Image,
  ScrollView,
  Text,
  Toast,
  ToastDescription,
  ToastTitle,
  useToast,
  VStack,
} from "@gluestack-ui/themed";
import BackgroundImg from "@assets/background.png";
import Logo from "@assets/logo.svg";
import { Input } from "@components/Input";
import { Button } from "@components/Button";
import { useNavigation } from "@react-navigation/native";
import { AuthNavigatorRoutesProps } from "@routes/auth.routes";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { api } from "../service/api";
import axios from "axios";
import { Alert } from "react-native";
import { AppError } from '@utils/AppError'

type FormDataProps = {
  name: string;
  email: string;
  password: string;
  password_confirm: string;
};

const signUpSchema = yup.object({
  name: yup.string().required("Informe o nome"),
  email: yup.string().required("Informe o e-mail").email("E-mail inválido"),
  password: yup
    .string()
    .required("Informe a senha")
    .min(6, "A senha deve ter pelo menos 6 dígitos."),
  password_confirm: yup
    .string()
    .required("Confirme a senha")
    .oneOf([yup.ref("password"), ""], "A confirmação da senha não confere."),
});

export function SignUp() {
  const navigation = useNavigation<AuthNavigatorRoutesProps>();
  const toast = useToast();

  function handleNewAccount() {
    navigation.navigate("signIn");
  }

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormDataProps>({
    resolver: yupResolver(signUpSchema),
  });

  async function handleSignUp({ name, email, password }: FormDataProps) {
    try {
      const response = await api.post("/users", { name, email, password });
      console.log(response.data);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const isAppError = error instanceof AppError;
    
        const title = isAppError
          ? error.message
          : "Não foi possível criar a conta. Tente novamente mais tarde";
    
          toast.show({
            placement: "bottom",
            render: ({ id }) => {
              const toastId = "toast-" + id
              return (
                <Toast nativeID={toastId} action="error" variant="solid">
                    <ToastDescription>
                      {title}
                    </ToastDescription>
                </Toast>
              )
            },
          })
      }
    }
  }

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
              // rules={{
              //   required: "Informe o nome",
              // }}
              render={({ field: { onChange, value } }) => (
                <Input
                  placeholder="Nome"
                  onChangeText={onChange}
                  value={value}
                  errorMessage={errors.name?.message}
                />
              )}
            />

            <Controller
              control={control}
              name="email"
              // rules={{
              //   required: "Informe o email",
              //   pattern: {
              //     value:/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              //     message: 'E-mail inválido'
              //   }
              // }}
              render={({ field: { onChange, value } }) => (
                <Input
                  placeholder="E-mail"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  onChangeText={onChange}
                  value={value}
                  errorMessage={errors.email?.message}
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
                  errorMessage={errors.password?.message}
                />
              )}
            />

            <Controller
              control={control}
              name="password_confirm"
              render={({ field: { onChange, value } }) => (
                <Input
                  placeholder="Confirme a senha"
                  secureTextEntry
                  onChangeText={onChange}
                  value={value}
                  errorMessage={errors.password_confirm?.message}
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
