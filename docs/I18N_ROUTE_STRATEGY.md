# Internationalization Route Strategy

## URL Structure Approach
We'll implement a prefix-based URL structure that:
- Places language code as first path segment (e.g., `/en/products`)
- Maintains Shopify's existing route structure after the language code
- Defaults to English (`/en/`) when no language specified
- Supports SEO through hreflang tags and sitemap localization

## Implementation Details

1. **Route Structure**:
   ```
   /[lang]/[existing routes]
   ```

2. **Supported Languages**:
   - English (en)
   - Spanish (es) 
   - French (fr)

3. **Technical Implementation**:
   - Create a root route that handles language detection/redirection
   - Wrap existing routes in a language route group
   - Store selected language in session/cookie
   - Add language context to all GraphQL queries

4. **SEO Considerations**:
   - Generate localized sitemaps
   - Implement hreflang tags
   - Maintain canonical URLs
   - Support language switcher for search engines

5. **Edge Cases**:
   - Handle invalid language codes
   - Maintain existing URLs with 301 redirects
   - Preserve query parameters during redirects