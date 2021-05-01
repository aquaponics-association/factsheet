import React from "react";
import {
  Box,
  Center,
  Container,
  Heading,
  HStack,
  Link,
  Spacer,
  VStack,
} from "@chakra-ui/layout";
import { Tag, TagLabel, TagLeftIcon } from "@chakra-ui/tag";
import { useHistory, useParams } from "react-router";
import { CategoryModel } from "../models/CategoryModel";
import { gql, useQuery } from "@apollo/client";
import { Spinner } from "@chakra-ui/spinner";
import { FaChevronLeft, FaLink, FaTag } from "react-icons/fa";
import { Image } from "@chakra-ui/image";
import { Button, IconButton } from "@chakra-ui/button";
import { ResearchModel } from "../models/ResearchModel";

const GET_FACT = gql`
  query GetFact($id: ID!) {
    fact(id: $id) {
      id
      text
      updated_at
      categories {
        id
        name
      }
      research {
        id
        title
        url
        description
        citation
        updated_at
      }
    }
  }
`;

const Component = () => {
  const history = useHistory();
  const { id } = useParams<{ id: string }>();
  const { loading, data } = useQuery(GET_FACT, {
    variables: {
      id,
    },
  });

  return (
    <>
      <Box
        bg="gray.100"
        pt={24}
        pb={10}
        mb={6}
        borderBottomWidth={1}
        borderColor="gray.200"
        shadow="sm"
      >
        <Container maxW="5xl">
          <VStack spacing={4}>
            <Link href="https://aquaponicsassociation.org/" isExternal>
              <Image
                src="/assets/images/logo.png"
                w={40}
                alt="The Aquaponics Association"
              />
            </Link>
          </VStack>
        </Container>
      </Box>

      <Container maxW="5xl">
        <Button
          onClick={() => history.push("/")}
          leftIcon={<FaChevronLeft />}
          variant="outline"
          size="lg"
        >
          Back to Facts
        </Button>
        <Box py={4}>
          {loading && (
            <Center py={4}>
              <Spinner color="gray.300" size="xl" />
            </Center>
          )}
          {!loading && (
            <VStack as="article" alignItems="start">
              <Box w="full" borderWidth={1} rounded="lg" p={10}>
                <Heading
                  textAlign="center"
                  as="h1"
                  size="lg"
                  fontWeight="normal"
                >
                  {data.fact.text}
                </Heading>
                {data.fact?.categories && data.fact.categories.length > 0 && (
                  <Box textAlign="center" mt={10}>
                    {data.fact.categories.map((category: CategoryModel) => {
                      return (
                        <Tag
                          size="md"
                          mr={2}
                          key={category.id}
                          cursor="pointer"
                          _hover={{ bg: "gray.200" }}
                          bg="gray.100"
                          color="gray.700"
                          onClick={() =>
                            history.push(`/?categories=${category.id}`)
                          }
                        >
                          <TagLeftIcon as={FaTag} />
                          <TagLabel>{category.name}</TagLabel>
                        </Tag>
                      );
                    })}
                  </Box>
                )}
              </Box>
              <Spacer pt={10} />
              {data.fact?.research && data.fact.research.length > 0 && (
                <VStack alignItems="start" w="full">
                  <Heading size="lg" as="h2">
                    Research
                  </Heading>
                  {data.fact.research.map((item: ResearchModel) => (
                    <HStack
                      borderWidth={1}
                      borderColor="gray.100"
                      p={2}
                      rounded="md"
                      w="full"
                    >
                      <Heading
                        as="h3"
                        noOfLines={1}
                        fontWeight="light"
                        size="md"
                      >
                        <Link href={item.url} isExternal>
                          {item.title}
                        </Link>
                      </Heading>
                      <Spacer />
                      {item.url && (
                        <Link href={item.url} isExternal>
                          <IconButton
                            aria-label="website"
                            icon={<FaLink />}
                            variant="ghost"
                          />
                        </Link>
                      )}
                    </HStack>
                  ))}
                </VStack>
              )}
            </VStack>
          )}
        </Box>
      </Container>
    </>
  );
};

export default Component;
