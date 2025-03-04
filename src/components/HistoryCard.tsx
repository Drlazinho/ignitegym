
import { HistoryDTO } from '@dtos/HistoryDTO'
import { Heading, HStack, Text, VStack } from '@gluestack-ui/themed'

type Props = {
  data: HistoryDTO;
}
export function HistoryCard({data} : Props) {
  return (
    <HStack
      w="$full"
      px="$5"
      py="$4"
      mb="$3"
      bg="$trueGray600"
      rounded="$md"
      alignItems="center"
      justifyContent="space-between"
    >
      <VStack mr="$5" flex={1}>
        <Heading
          color="$white"
          fontSize="$md"
          fontFamily="$heading"
          textTransform="capitalize"
          numberOfLines={1}
        >
          {data.group}
          </Heading>
        <Text color="$trueGray100" fontSize="$lg" numberOfLines={1}>
        {data.name}
        </Text>
      </VStack>
      <Text color="$trueGray300" fontSize="$md">
      {data.hour}
      </Text>
    </HStack>
  )
}