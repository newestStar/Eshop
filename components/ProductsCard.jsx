import { useEffect, useState } from "react";
import {
  Card,
  Heading,
  TextContainer,
  DisplayText,
  TextStyle,
  Button,
} from "@shopify/polaris";
import { Toast, useAppBridge } from "@shopify/app-bridge-react";
import { gql, useMutation } from "@apollo/client";

import { userLoggedInFetch } from "../utils/auth";

const PRODUCTS_QUERY = gql`
  mutation populateProduct($input: ProductInput!) {
    productCreate(input: $input) {
      product {
        title
      }
    }
  }
`;

export function ProductsCard() {
  const [populateProduct, { loading }] = useMutation(PRODUCTS_QUERY);
  const [productCount, setProductCount] = useState(0);
  const [hasResults, setHasResults] = useState(false);

  const app = useAppBridge();
  const fetch = userLoggedInFetch(app);
  async function updateProductCount() {
    const { count } = await fetch("/api/products-count").then((res) =>
      res.json()
    );
    setProductCount(count);
  }

  useEffect(() => {
    updateProductCount();
  }, []);

  const toastMarkup = hasResults && (
    <Toast
      content="5 products created!"
      onDismiss={() => setHasResults(false)}
    />
  );

  return (
    <>
      {toastMarkup}
      <Card title="Product Counter" sectioned>
        <TextContainer spacing="loose">
          <p>
            Sample products are created with a default title and price. You can
            remove them at any time.
          </p>
          <Heading element="h4">
            TOTAL PRODUCTS
            <DisplayText size="medium">
              <TextStyle variation="strong">{productCount}</TextStyle>
            </DisplayText>
          </Heading>
          <Button
            primary
            loading={loading}
            onClick={() => {
              Promise.all(
                Array.from({ length: 5 }).map(() =>
                  populateProduct({
                    variables: {
                      input: {
                        title: randomTitle(),
                      },
                    },
                  })
                )
              ).then(() => {
                updateProductCount();
                setHasResults(true);
              });
            }}
          >
            Populate 5 products
          </Button>
        </TextContainer>
      </Card>
    </>
  );
}
