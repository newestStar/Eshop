import {authenticatedFetch} from '@shopify/app-bridge-utils'
import {Redirect} from '@shopify/app-bridge/actions'

export function userLoggedInFetch(app) {
  const fetchFunction = authenticatedFetch(app)

  return async (uri, options) => {
    const response = await fetchFunction(uri, options)

    if (response.headers.get('X-Shopify-API-Request-Failure-Reauthorize') === '1') {
      const authUrlHeader = response.headers.get('X-Shopify-API-Request-Failure-Reauthorize-Url')

      const redirect = Redirect.create(app)
      redirect.dispatch(Redirect.Action.APP, authUrlHeader || `/api/auth`)
      return null
    }

    return response
  }
}
