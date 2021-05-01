import React, { useCallback, useEffect } from "react";
import {
  Box,
  Center,
  Container,
  HStack,
  Link,
  LinkBox,
  LinkOverlay,
  SimpleGrid,
  Spacer,
  Text,
  VStack,
} from "@chakra-ui/layout";
import { Tag, TagLabel, TagLeftIcon } from "@chakra-ui/tag";
import { useMemo, useState } from "react";
import { useHistory, useLocation } from "react-router";
import { FactModel } from "../models/FactModel";
import { CategoryModel } from "../models/CategoryModel";
import qs from "qs";
import { gql, useQuery } from "@apollo/client";
import { Spinner } from "@chakra-ui/spinner";
import { FaSearch, FaTag } from "react-icons/fa";
import _ from "lodash";
import { Input, InputGroup, InputLeftElement } from "@chakra-ui/input";
import Icon from "@chakra-ui/icon";
import { Image } from "@chakra-ui/image";
import { useDebounce } from "../utils";

const LIST_CATEGORIES = gql`
  query ListCategories {
    categories: factCategories {
      id
      name
    }
  }
`;

const LIST_FACTS = gql`
  query ListFacts($where: JSON) {
    facts(where: $where) {
      id
      text
      categories {
        id
        name
      }
      research {
        id
      }
    }
  }
`;

const Component = () => {
  const location = useLocation();
  const history = useHistory();
  const query: any = useMemo(
    () => qs.parse(location.search, { ignoreQueryPrefix: true }),
    [location]
  );
  const { data: categoryData } = useQuery(LIST_CATEGORIES);
  const [categories, setCategories] = useState<string[]>([]);
  const [search, setSearch] = useState<string | undefined>();
  const debouncedSearch = useDebounce(search, 300);
  const whereStatement = useMemo(() => {
    const statement: any = {};

    if (debouncedSearch) {
      statement._q = debouncedSearch;
    }

    if (categories.length > 0) {
      statement._where = {
        categories: {
          id_in: categories,
        },
      };
    }

    return statement;
  }, [categories, debouncedSearch]);
  const { loading, data } = useQuery(LIST_FACTS, {
    variables: {
      where: whereStatement,
    },
  });

  useEffect(() => {
    const queryCategories = query?.categories?.toString().split(",");
    if (!_.isEmpty(query?.categories)) {
      setCategories(queryCategories);
    }
  }, [query?.categories]);

  const toggleCategory = useCallback(
    (category: CategoryModel) => {
      const idx = categories.indexOf(category.id.toString());
      const arr = [...categories];
      if (idx !== -1) {
        arr.splice(idx, 1);
        setCategories(arr);
      } else {
        arr.push(category.id);
        setCategories(arr);
      }

      history.push(`/?categories=${arr.join(",")}`);
    },
    [categories, history]
  );

  return (
    <>
      <Box
        bg="gray.100"
        pt={24}
        pb={10}
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
            <Text maxW="xl" textAlign="center" fontSize="lg">
              Welcome to the verified factsheet of Aquaponic benefits! Below
              you'll find up-to-date and important facts regarding the benefits
              of Aquaponics and the research associated with these findings.
            </Text>
            <InputGroup size="lg" bg="white">
              <InputLeftElement
                pointerEvents="none"
                children={<Icon as={FaSearch} color="gray.300" />}
              />
              <Input
                placeholder="Search facts..."
                onChange={(e: any) => setSearch(e.target.value)}
              />
            </InputGroup>
            <Box mb={10}>
              {categoryData &&
                categoryData.categories.map((category: CategoryModel) => {
                  const selected = categories.indexOf(category.id) !== -1;
                  return (
                    <Tag
                      size="lg"
                      mr={2}
                      key={category.id}
                      cursor="pointer"
                      _hover={
                        selected ? { bg: "green.500" } : { bg: "gray.200" }
                      }
                      onClick={() => toggleCategory(category)}
                      bg={selected ? "green.400" : "gray.100"}
                      color={selected ? "white" : "gray.700"}
                    >
                      <TagLeftIcon as={FaTag} />
                      <TagLabel>{category.name}</TagLabel>
                    </Tag>
                  );
                })}
            </Box>
          </VStack>
        </Container>
      </Box>

      <Container maxW="5xl">
        <Box py={10}>
          {loading && (
            <Center py={4}>
              <Spinner color="gray.300" size="xl" />
            </Center>
          )}
          {!loading && (
            <SimpleGrid spacing={4} columns={{ base: 1, md: 2, lg: 3 }}>
              {data?.facts?.map((fact: FactModel) => (
                <LinkBox
                  display="flex"
                  key={fact.id}
                  as="article"
                  p={5}
                  borderWidth={1}
                  rounded="md"
                  _hover={{
                    shadow: "md",
                  }}
                >
                  <VStack alignItems="start">
                    <Text color="gray.400">#{fact.id}</Text>
                    <LinkOverlay href={`/fact/${fact.id}`}>
                      <Text noOfLines={3} as="h3" fontSize="lg">
                        {fact.text}
                      </Text>
                    </LinkOverlay>
                    <Spacer />
                    <HStack>
                      {fact?.research && fact.research.length > 0 && (
                        <Tag colorScheme="blue" variant="outline">
                          Citations {fact.research.length}
                        </Tag>
                      )}
                      {fact?.categories && fact.categories.length > 0 && (
                        <Tag colorScheme="gray" variant="outline">
                          Categories {fact.categories.length}
                        </Tag>
                      )}
                    </HStack>
                  </VStack>
                </LinkBox>
              ))}
            </SimpleGrid>
          )}
        </Box>
      </Container>
    </>
  );
};

export default Component;
