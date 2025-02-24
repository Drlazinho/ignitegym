import {
  Heading,
  HStack,
  Icon,
  VStack,
  Text,
  Image,
  ScrollView,
  Box,
  Toast,
  ToastDescription,
  useToast,
} from "@gluestack-ui/themed";
import { useNavigation, useRoute } from "@react-navigation/native";
import { AppNavigatorRoutesProps } from "@routes/app.routes";
import { ArrowLeft } from "lucide-react-native";
import { TouchableOpacity } from "react-native";
import SeriesSvg from "@assets/series.svg";
import RepetitionsSvg from "@assets/repetitions.svg";
import { Button } from "@components/Button";

import BodySvg from "@assets/body.svg";
import { AppError } from "@utils/AppError";
import { api } from "../service/api";
import { ExerciseDTO } from "@dtos/ExerciseDTO";
import { useEffect, useState } from "react";

type RouteParamsProps = {
  exerciseId: string;
};
export function Exercise() {
  const [exercise, setExercise] = useState<ExerciseDTO>({} as ExerciseDTO);
  const navigation = useNavigation<AppNavigatorRoutesProps>();
  const toast = useToast();

  const route = useRoute();

  const { exerciseId } = route.params as RouteParamsProps;

  function handleGoBack() {
    navigation.goBack();
  }

  async function fetchExerciseDetails() {
    try {
      const response = await api.get(`/exercises/${exerciseId}`);

      setExercise(response.data);
    } catch (error) {
      const isAppError = error instanceof AppError;
      const title = isAppError
        ? error.message
        : "Não foi possível carregar os detalhes do exercício";

      toast.show({
        placement: "bottom",
        render: ({ id }) => {
          const toastId = "toast-" + id;
          return (
            <Toast nativeID={toastId} action="error" variant="solid">
              <ToastDescription>{title}</ToastDescription>
            </Toast>
          );
        },
      });
    }
  }

  useEffect(() => {
    fetchExerciseDetails();
  },[exerciseId])

  return (
    <VStack flex={1}>
      <VStack px="$8" bg="$trueGray600" pt="$12">
        <TouchableOpacity onPress={handleGoBack}>
          <Icon as={ArrowLeft} color="$green500" size="xl" />
        </TouchableOpacity>
        <HStack
          justifyContent="space-between"
          alignItems="center"
          mt="$4"
          mb="$8"
        >
          <Heading
            color="$trueGray100"
            fontFamily="$heading"
            fontSize="$lg"
            flexShrink={1}
          >
            {exercise.name}
          </Heading>
          <HStack alignItems="center">
            <BodySvg />
            <Text color="$trueGray200" ml="$1" textTransform="capitalize">
              {exercise.group}
            </Text>
          </HStack>
        </HStack>
      </VStack>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 32 }}
      >
        <VStack p="$8">
          <Image
            source={{
              uri: `${api.defaults.baseURL}/exercise/demo/${exercise?.demo}`,
            }}
            alt="Exercício"
            mb="$3"
            resizeMode="cover"
            rounded="$lg"
            w="$full"
            h="$80"
          />
          <Box bg="$trueGray600" rounded="$md" pb="$4" px="$4">
            <HStack
              alignItems="center"
              justifyContent="space-around"
              mb="$6"
              mt="$5"
            >
              <HStack>
                <SeriesSvg />
                <Text color="$trueGray200" ml="$2">
                {exercise.series} séries
                </Text>
              </HStack>
              <HStack>
                <RepetitionsSvg />
                <Text color="$trueGray200" ml="$2">
                {exercise.repetitions} repetições
                </Text>
              </HStack>
            </HStack>
            <Button title="Marcar como realizado" />
          </Box>
        </VStack>
      </ScrollView>
    </VStack>
  );
}
