import React, { useCallback, useEffect } from "react";
import {
  Box,
  Container,
  HStack,
  SimpleGrid,
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
import { FaTag } from "react-icons/fa";
import _ from "lodash";

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
  const whereStatement = useMemo(
    () =>
      categories.length > 0
        ? {
            categories: {
              id_in: categories,
            },
          }
        : undefined,
    [categories]
  );
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
  }, []);

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
    [categories]
  );

  return (
    <Container maxW="5xl">
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
                _hover={selected ? { bg: "green.500" } : { bg: "gray.200" }}
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
      {loading && <Spinner color="blue.500" size="xl" />}
      {!loading && (
        <SimpleGrid spacing={4} columns={3}>
          {data?.facts?.map((fact: FactModel) => (
            <VStack
              key={fact.id}
              alignItems="start"
              borderWidth={1}
              borderColor="gray.300"
              rounded="md"
              w="full"
              p={4}
              _hover={{
                shadow: "md",
              }}
            >
              <Text noOfLines={3} as="h3" fontSize="lg">
                {fact.text}
              </Text>
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
          ))}
        </SimpleGrid>
      )}
    </Container>
  );
};

export default Component;
