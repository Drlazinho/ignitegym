import { ExerciseDTO } from "@dtos/ExerciseDTO";
import {
  Text,
  Heading,
  HStack,
  Image,
  VStack,
  Icon,
} from "@gluestack-ui/themed";
import { ChevronRight } from "lucide-react-native";
import { TouchableOpacity, TouchableOpacityProps } from "react-native";
import { api } from '../service/api'

type Props = TouchableOpacityProps & {
  data: ExerciseDTO;
};

export function ExerciseCard({ data, ...props }: Props) {
  return (
    <TouchableOpacity {...props}>
      <HStack
        bg="$trueGray500"
        alignItems="center"
        p="$2"
        pr="$4"
        rounded="$md"
        mb="$3"
      >
        <Image
          source={{
            uri: `${api.defaults.baseURL}/exercise/thumb/${data.thumb}`,
          }}
          alt="Imagem do exercício"
          w="$16"
          h="$16"
          rounded="$md"
          mr="$4"
          resizeMode="cover"
        />
        <VStack flex={1}>
          <Heading fontSize="$lg" color="$white" fontFamily="$heading">
            {data.name}
          </Heading>
          <Text fontSize="$sm" color="$trueGray200" mt="$1" numberOfLines={2}>
            {data.series} séries x {data.repetitions} repetições
          </Text>
        </VStack>
        <Icon as={ChevronRight} color="$trueGray300" />
      </HStack>
    </TouchableOpacity>
  );
}
