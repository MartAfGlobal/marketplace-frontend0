**MARTAFF API DOCUMENTATION**

**\==================================**  
     	**Register API**  
**\==================================**

**Endpoint:   	/accounts/register**  
**Method(s):  	POST, OPTIONS**  
**Description:	Register a new user account as a customer or manufacturer.**

**\----------------------------------**  
**Request \- POST**  
**\----------------------------------**

**Content-Types supported:**  
**\- application/json**  
**\- application/x-www-form-urlencoded**  
**\- multipart/form-data**

**Fields:**

**1\. id**  
   **\- Type:    	string**  
   **\- Required:	No**  
   **\- Read Only:   Yes**  
   **\- Description: Auto-generated user ID**

**2\. is\_customer**  
   **\- Type:    	boolean**  
   **\- Required:	No**  
   **\- Read Only:   No**  
   **\- Description: Set to true to register as a customer**

**3\. is\_manufacturer**  
   **\- Type:    	boolean**  
   **\- Required:	No**  
   **\- Read Only:   No**  
   **\- Description: Set to true to register as a manufacturer**

**4\. email**  
   **\- Type:    	email**  
   **\- Required:	Yes**  
   **\- Read Only:   No**  
   **\- Max Length:  254**  
   **\- Description: User's email address**

**5\. password**  
   **\- Type:    	string**  
   **\- Required:	Yes**  
   **\- Read Only:   No**  
   **\- Max Length:  128**  
   **\- Description: Account password**

**\----------------------------------**  
**Response \- 200 OK (on success)**  
**\----------------------------------**

**The server responds with:**  
**\- Status: 200 OK**  
**\- Description: Success message and user details (excluding password)**

**\----------------------------------**  
**OPTIONS \- Metadata**  
**\----------------------------------**

**OPTIONS /accounts/register**

**Response:**  
**\- Allow: POST, OPTIONS**  
**\- Content-Type: application/json**  
**\- Renders: application/json, text/html**  
**\- Parses: application/json, application/x-www-form-urlencoded, multipart/form-data**

**\----------------------------------**

**\==================================**  
       	**Login API**  
**\==================================**

**Endpoint:   	/accounts/login**  
**Method(s):  	POST, OPTIONS**  
**Description:	Authenticate a user and return JWT access token.**  
            	**Supports "remember me" functionality affecting token expiry.**

**\----------------------------------**  
**Request \- POST**  
**\----------------------------------**

**Content-Types supported:**  
**\- application/json**  
**\- application/x-www-form-urlencoded**  
**\- multipart/form-data**

**Request Body Parameters:**

**1\. email**  
   **\- Type:   	string (email)**  
   **\- Required:   Yes**  
   **\- Description: User's registered email address.**

**2\. password**  
   **\- Type:   	string**  
   **\- Required:   Yes**  
   **\- Description: User's password.**

**3\. remember\_me**  
   **\- Type:   	boolean or string ("true", "on", "1" considered True)**  
   **\- Required:   No**  
   **\- Description: If true, issues a refresh token with default lifetime;**  
              	**if false or omitted, issues a short-lived access token (10 minutes).**

**\----------------------------------**  
**Response \- 200 OK (on success)**  
**\----------------------------------**

**Response Body:**  
**\- access (string): JWT access token.**

**Headers & Cookies:**  
**\- Sets a HTTP-only cookie with the refresh token. Cookie properties depend on**  
  **settings (secure, expiry, SameSite, HTTP-only).**  
**\- Includes \`X-CSRFToken\` header.**

**Notes:**  
**\- If authentication fails, responds with 401 Unauthorized and message:**  
  **"Email or Password is incorrect".**

**\----------------------------------**  
**OPTIONS \- Metadata**  
**\----------------------------------**

**OPTIONS /accounts/login**

**Response:**  
**\- Allow: POST, OPTIONS**  
**\- Content-Type: application/json**  
**\- Renders: application/json, text/html**  
**\- Parses: application/json, application/x-www-form-urlencoded, multipart/form-data**

**\----------------------------------**

**\==============================**  
       	**Logout API**  
**\==============================**

**Endpoint:   	/accounts/logout**  
**Method:     	POST**  
**Description:	Logs out the authenticated user by blacklisting the refresh token**  
            	**and clearing authentication cookies.**

**\------------------------------**  
**Request \- POST**  
**\------------------------------**

**Headers:**  
**\- Must include cookies with refresh token (stored in HTTP-only cookie).**

**Request Body:**  
**\- None**

**\------------------------------**  
**Response \- 200 OK (success)**  
**\------------------------------**

**Body:**  
**{**  
  **"message": "Successfully logged out."**  
**}**

**Cookies:**  
**\- Deletes access token cookie**  
**\- Deletes refresh token cookie**  
**\- Deletes CSRF-related cookies ("csrftoken" and "X-CSRFToken")**

**\------------------------------**  
**Error Responses**  
**\------------------------------**

**\- 401 Unauthorized**  
  **Body:**  
  **{**  
	**"detail": "No refresh token provided."**  
  **}**

**\- 401 Unauthorized**  
  **Body:**  
  **{**  
	**"detail": "Invalid or expired token. Please log in again."**  
  **}**

**\------------------------------**  
**Notes:**  
**\- Blacklists the refresh token to prevent reuse.**  
**\- Clears session cart ("cart\_id") if present.**

**\==============================**  
       	**Logout API**  
**\==============================**

**Endpoint:   	/accounts/logout**  
**Method:     	POST**  
**Description:	Logs out the user by blacklisting the refresh token and clearing authentication cookies and session data.**

**\------------------------------**  
**Request**  
**\------------------------------**

**Headers:**  
**\- Must include cookies with the refresh token (HTTP-only cookie).**

**Body:**  
**\- None**

**\------------------------------**  
**Response \- 200 OK (Success)**  
**\------------------------------**

**Body:**  
**{**  
  **"message": "Successfully logged out."**  
**}**

**Cookies cleared:**  
**\- Access token cookie**  
**\- Refresh token cookie**  
**\- CSRF cookies ("csrftoken" and "X-CSRFToken")**

**Session:**  
**\- Removes "cart\_id" from session if it exists**

**\------------------------------**  
**Error Responses**  
**\------------------------------**

**401 Unauthorized**  
**\- If no refresh token is provided:**  
  **{**  
	**"detail": "No refresh token provided."**  
  **}**

**\- If refresh token is invalid or expired:**  
  **{**  
	**"detail": "Invalid or expired token. Please log in again."**  
  **}**

**\==============================**  
    	**Google Login API**  
**\==============================**

**Endpoint:   	/accounts/google/login**  
**Method:     	GET (or whichever method your URL uses)**  
**Description:	Handles login via Google OAuth using Django social accounts.**  
            	**Links Google account to existing user or creates a new user if none exists.**  
            	**Sends a one-time login email link for new users.**  
            	**Logs in the user and redirects to frontend callback URL.**

**\------------------------------**  
**Request**  
**\------------------------------**

**\- The user must already be authenticated via Google OAuth (i.e., logged in to social account).**  
**\- No request body needed.**

**\------------------------------**  
**Behavior & Flow**  
**\------------------------------**

**1\. Checks if the user is authenticated:**  
   **\- If not, respond**

**401 Unauthorized:**  
**{**  
	**"error": "User not authenticated"**  
**}**

**2\. Retrieves the Google email from the linked SocialAccount.**  
   **\- If email not found, respond**

**400 Bad Request:**  
**{**  
	**"error": "Email not found in social account"**  
**}**

**3\. Checks if a user with that email exists:**  
   **\- If yes, links the social account if not already linked.**  
   **\- If no, creates a new user with:**  
   	**\- Random password**  
   	**\- Flag \`is\_google\_user \= True\`**  
 	**Sends a one-time login email with a unique login link.**

**4\. Logs in the user via Django authentication backend.**

**5\. Sends Access token and refresh token as HTTP Only to the frontend:**

**\------------------------------**  
**Response**  
**\------------------------------**

**{**  
**‘access’: “\<your\_access\_token\_value\>”**  
**}** 

**\------------------------------**  
**Errors (Responses)**  
**\------------------------------**

**401 Unauthorized:**  
**{**  
	**"error": "User not authenticated"**  
**}**

**404 Not Found:**  
**{**  
	**"error": "Social account not found"**  
**}**

**400 Bad Request:**  
**{**  
	**"error": "Email not found in social account"**  
**}**

**\------------------------------**  
**Email sent (for new users)**  
**\------------------------------**

**\- Subject: "Welcome to MARTAF — One-Time Login Link"**  
**\- Contains a one-time login link to authenticate without password.**  
**\- Email is sent in both HTML and plain text formats.**

**\------------------------------------------------------------**  
**Additional Notes**  
**\------------------------------------------------------------**

**\- Requires user to be logged in through Django session (typically via Google OAuth).**  
**\- The function uses 'dj-rest-auth' or 'allauth' to fetch the linked SocialAccount.**  
**\- Refresh token is stored in an HttpOnly cookie as per SIMPLE\_JWT settings.**  
**\- For new users, a random password is generated and a one-time login token is emailed.**  
**\- The backend used for login is: 'django.contrib.auth.backends.ModelBackend'.**  
**\- Email template used: 'emails/one\_time\_login\_email.html'**  
**\- Email includes a link formatted as: http://localhost:5173/one-time-login/?uid=\<uid\>\&token=\<token\>**

**\==========================**  
**Customer API Documentation**  
**\==========================**

**Endpoint**  
**\--------**  
**GET, PATCH /accounts/customer**

**Authentication**  
**\--------------**  
**\- Requires user to be authenticated via JWT token.**

**Description**  
**\-----------**  
**Retrieve or update the profile of the authenticated user if they have a customer or manufacturer role.**

**GET Request**  
**\-----------**  
**\- Returns the profile information for the authenticated user.**  
**\- If the user is a customer only (not a manufacturer), returns the Customer profile.**  
**\- If the user is both a customer and manufacturer, returns the Manufacturer profile.**  
**\- Returns error if user is neither customer nor manufacturer.**

**Response**  
**\--------**  
**\- 200 OK with profile data:**

  **For Customer:**  
	**\- user: User ID**  
	**\- profile\_picture: Image URL (optional)**  
	**\- contact\_details: JSON object with contact info (optional)**  
	**\- loyalty\_points: Read-only integer**  
	**\- created\_at: Profile creation datetime (read-only)**

  **For Manufacturer:**  
	**\- user: User ID**  
	**\- profile\_picture: Image URL (optional)**  
	**\- bank\_details: JSON object with bank info (required)**  
	**\- created\_at: Profile creation datetime (read-only)**

**\- 400 Bad Request if the user is not a customer or manufacturer.**

**PATCH Request**  
**\-------------**  
**\- Update profile fields partially.**  
**\- Supports multipart/form-data for updating images (profile\_picture).**  
**\- Accepts fields depending on role (Customer or Manufacturer).**

**Request Body (partial fields allowed)**  
**\------------------------------------**  
**\- Customer update fields:**  
  **\- profile\_picture (image file, optional)**  
  **\- contact\_details (JSON object, optional)**

**\- Manufacturer update fields:**  
  **\- profile\_picture (image file, optional)**  
  **\- bank\_details (JSON object, required for Manufacturer)**

**Response**  
**\--------**  
**\- 200 OK with updated profile data on success.**  
**\- 400 Bad Request with validation errors if data is invalid.**  
**\- 400 Bad Request with error message "No user details found\!" if user role invalid.**

**Notes**  
**\-----**  
**\- Profile picture is optional and can be updated via file upload.**  
**\- Customer's loyalty points and created\_at fields are read-only.**  
**\- Manufacturer’s created\_at field is read-only.**  
**\- User is identified via JWT token authentication.**  
**\- Appropriate serializers (CustomerSerializer or ManufacturerSerializer) are used based on user role.**

**\===============================**  
**Reset Password API Documentation**  
**\===============================**

**Endpoint**  
**\--------**  
**POST /reset-password/**

**Authentication**  
**\--------------**  
**\- No authentication required.**

**Description**  
**\-----------**  
**Initiates a password reset request by generating a secure token and sending a password reset email to the provided email address.**

**Request Body**  
**\------------**  
**\- email (string, required): The email address of the user requesting password reset.**

**Process**  
**\-------**  
**1\. Validates that the user with the provided email exists and is active.**  
**2\. Generates a secure random token (UUID) and hashes it with SHA-256.**  
**3\. Sets an expiry time of 5 minutes for the reset token.**  
**4\. Stores or updates the hashed token and expiry time in the database linked to the user.**  
**5\. Creates a password reset URL containing the raw token as a URL parameter.**  
**6\. Sends an email to the user with the password reset link and expiry information.**

**Response**  
**\--------**  
**\- 200 OK**  
  **{**  
	**"message": "Password reset email sent"**  
  **}**

**Errors**  
**\------**  
**\- 401 Unauthorized (AuthenticationFailed) if user with the provided email is not found or inactive.**

**Notes**  
**\-----**  
**\- The reset token stored in the database is hashed; the raw token is sent in the email.**  
**\- The reset link expires after 5 minutes.**  
**\- The email sender is "no-reply@martaf.com".**  
**\- The reset URL points to the endpoint named 'reset-password-confirm' with the token in the URL.**

**\=============================================**  
**Reset Password Confirmation API Documentation**  
**\=============================================**

**Endpoint**  
**\--------**  
**POST /reset-password-confirm/{token}/**

**Authentication**  
**\--------------**  
**\- No authentication required.**

**Description**  
**\-----------**  
**Confirms and completes a password reset by verifying the reset token and updating the user's password.**

**Path Parameters**  
**\---------------**  
**\- token (string, required): The password reset token received by the user via email.**

**Request Body**  
**\------------**  
**\- password (string, required): The new password to set for the user.**

**Process**  
**\-------**  
**1\. Validates that a new password is provided.**  
**2\. Hashes the token from the URL to match the stored hashed token in the database.**  
**3\. Checks if the hashed token exists in the PasswordResetToken table.**  
**4\. Validates that the token is not expired; if expired, deletes the token entry.**  
**5\. Validates the new password against Django's password complexity requirements.**  
**6\. Updates the user's password securely.**  
**7\. Deletes the reset token entry after successful password update.**

**Response**  
**\--------**  
**\- 200 OK**  
  **{**  
	**"message": "Password reset successful"**  
  **}**

**Errors**  
**\------**  
**\- 400 Bad Request**  
  **\- If the password is missing.**  
  **\- If the token is invalid or not found.**  
  **\- If the token has expired.**  
  **\- If the new password does not meet validation requirements (error message returned).**

**Notes**  
**\-----**  
**\- Password validation uses Django's built-in password validators.**  
**\- The reset token is single-use and removed upon successful password reset.**

**\==============================**  
**Forgot Email API Documentation**  
**\==============================**

**Endpoint**  
**\--------**  
**POST /forgot-email/**

**Authentication**  
**\--------------**  
**\- No authentication required.**

**Description**  
**\-----------**  
**Allows users who forgot their registered email address to retrieve a masked version of it via SMS using their registered phone number.**

**Request Body**  
**\------------**  
**\- phone\_number (string, required): The user's phone number in \*\*E.164 format\*\* (e.g., "+2348012345678").**

**Process**  
**\-------**  
**1\. Validates the phone number format to ensure it's in E.164 international standard.**  
**2\. Looks up the user with the provided phone number who is also marked as active.**  
**3\. If no user is found, returns a 404 Not Found.**  
**4\. Masks the user's email address to protect privacy (e.g., "j\*\*\*\*@domain.com").**  
**5\. Retrieves Twilio credentials from Django settings.**  
**6\. Sends an SMS to the provided phone number with the masked email using Twilio.**  
**7\. Returns a success message if the SMS is sent.**

**Response**  
**\--------**  
**\- 200 OK**  
  **{**  
	**"message": "Email address (masked) sent to phone number"**  
  **}**

**Errors**  
**\------**  
**\- 400 Bad Request**  
  **\- If the phone number is not provided or is not in the correct E.164 format.**  
**\- 404 Not Found**  
  **\- If no user is found with the provided phone number.**  
**\- 500 Internal Server Error**  
  **\- If SMS sending fails or Twilio credentials are missing or invalid.**

**Security Notes**  
**\--------------**  
**\- The email address is masked before being sent to enhance security.**

**\=============================**  
**Delete User API Documentation**  
**\=============================**

**Endpoint**  
**\--------**  
**accounts/delete/**

**Authentication**  
**\--------------**  
**\- Requires authentication (e.g., JWT token or session-based authentication).**

**Description**  
**\-----------**  
**Allows an authenticated user to permanently delete their account from the system.**

**Request**  
**\-------**  
**\- No request body required.**

**Process**  
**\-------**  
**1\. Authenticates the user making the request.**  
**2\. Deletes the user’s account from the database.**  
**3\. Returns a confirmation message.**

**Response**  
**\--------**  
**\- 200 OK**  
  **{**  
	**"message": "User deleted successfully"**  
  **}**

**Errors**  
**\------**  
**\- 401 Unauthorized**  
  **\- If the user is not authenticated.**

**Security Notes**  
**\--------------**  
**\- Deleting a user is irreversible unless you implement a soft-delete mechanism.**  
**\- It's recommended to request confirmation from the frontend before triggering this request.**

**\==============================**  
**User Details API Documentation**  
**\==============================**

**Endpoint**  
**\--------**  
**GET /accounts/UserDetails/**  
**PATCH /accounts/UserDetails/**

**Authentication**  
**\--------------**  
**\- Requires authentication (e.g., JWT token or session-based auth).**

**Permissions**  
**\-----------**  
**\- Only authenticated users can access or modify their own data.**

**Parsers**  
**\-------**  
**\- Accepts \`multipart/form-data\` and \`application/x-www-form-urlencoded\` for profile image updates or other file uploads.**

**\---------------------------**  
**GET /accounts/UserDetails/**  
**\---------------------------**  
**Description**  
**\-----------**  
**Returns the authenticated user's basic information and profile details.**

**Response Example**  
**\----------------**  
**200 OK**  
**{**  
  **"id": 1,**  
  **"is\_customer": true,**  
  **"is\_manufacturer": false,**  
  **"email": "user@example.com",**  
  **"profile": {**  
	**"id": 3,**  
	**"user": 1,**  
	**"profile\_picture": "http://domain.com/media/profile.jpg",**  
	**"contact\_details": {...},**  
	**"loyalty\_points": 50,**  
	**...**  
  **}**  
**}**

**Errors**  
**\------**  
**\- 401 Unauthorized: If the user is not authenticated.**

**\---------------------------**  
**PATCH /accounts/UserDetails/**  
**\---------------------------**  
**Description**  
**\-----------**  
**Partially updates the authenticated user's account and related profile (Customer or Manufacturer).**

**Request Body Example**  
**\--------------------**  
**Content-Type: multipart/form-data**

**{**  
  **"email": "newemail@example.com",**  
  **"profile\_picture": \<image\>,**  
  **"contact\_details": {**  
	**"phone": "+1234567890",**  
	**"address": "New address"**  
  **}**  
**}**

**Behavior**  
**\--------**  
**\- Updates both user fields (e.g., email) and profile fields (e.g., profile picture, contact details).**  
**\- If the user has a customer or manufacturer profile, that profile is updated accordingly.**

**Response Example**  
**\----------------**  
**200 OK**  
**{**  
  **"id": 1,**  
  **"is\_customer": true,**  
  **"is\_manufacturer": false,**  
  **"email": "newemail@example.com"**  
**}**

**Errors**  
**\------**  
**\- 400 Bad Request: If any validation error occurs in user or profile serializers.**  
**\- 401 Unauthorized: If the user is not authenticated.**

**Security Notes**  
**\--------------**  
**\- Only authenticated users can read or update their information.**  
**\- Ensure file upload handling (e.g., images) is secured and properly validated.**

**\=================================**  
**Token Refresh API (Cookie-Based)**  
**\=================================**

**Endpoint**  
**\--------**  
**POST /accounts/refresh/**

**Authentication**  
**\--------------**  
**\- Requires an HTTP-only cookie named as defined in \`SIMPLE\_JWT\['AUTH\_COOKIE\_REFRESH'\]\`.**  
**\- No need to include refresh token in request body — it is extracted from the cookie.**

**Description**  
**\-----------**  
**This endpoint provides a secure way to refresh access tokens by:**

**\- Reading the refresh token from a secure HttpOnly cookie.**  
**\- Validating the refresh token and rotating the access token.**  
**\- Respecting a "remember\_me" flag to set dynamic expiry for the access token.**  
**\- Blacklisting the old refresh token to prevent reuse.**  
**\- Re-setting the refresh token cookie in the response.**  
**\- Adding a new CSRF token in the response header (\`X-CSRFToken\`).**

**Request Headers**  
**\---------------**  
**\- Cookie: refresh=\<your\_refresh\_token\_cookie\_value\>**

**Request Body**  
**\------------**  
**(No refresh token required in the body — only optional fields like remember\_me are supported)**

**Example (optional):**  
**{**  
	**"remember\_me": true**  
**}**

**Successful Response**  
**\-------------------**  
**200 OK**  
**{**  
	**"access": "\<new\_access\_token\>"**  
**}**

**Response Headers**  
**\----------------**  
**\- Set-Cookie: \<HttpOnly Refresh Token\>**  
**\- X-CSRFToken: \<csrf\_token\_value\>**

**Failure Responses**  
**\-----------------**  
**400 Bad Request:**  
**{**  
	**"detail": "Refresh token missing"**  
**}**  
**\- Occurs if the refresh token cookie is not present.**

**401 Unauthorized:**  
**{**  
	**"detail": "Invalid refresh token"**  
**}**  
**\- Occurs if the token is expired, tampered with, or blacklisted.**

**Security Notes**  
**\--------------**  
**\- Refresh token is stored in a secure, HttpOnly cookie to prevent JavaScript access.**  
**\- Access token is short-lived (e.g., 10 mins) if \`remember\_me\` is False.**  
**\- Rotating and blacklisting refresh tokens helps prevent reuse attacks.**  
**\- CSRF token is sent in the response and should be included in future authenticated requests.**

**Remarks**  
**\-------**  
**This view extends \`TokenRefreshView\` from \`rest\_framework\_simplejwt.views\` and overrides request handling and final response behavior to:**  
**\- Improve security**  
**\- Enhance UX via auto-login mechanisms**  
**\- Support “remember me” logic**

**\===============================**  
   	**PRODUCT API DOCS**  
**\===============================**

**Overview:**  
**\---------**  
**This API manages products with support for categories, images, stock tracking, and optional product variations.**

**Serializer: ProductSerializer**

**Fields:**  
**\-------**  
**\- id (int, read-only): Auto-generated product ID.**  
**\- manufacturer (read-only): Set from context; the owner of the product.**  
**\- name (string, required): Name of the product.**  
**\- description (string, optional): Description of the product.**  
**\- price (decimal, required): Base price of the product.**  
**\- discount\_percent (float, optional): Discount percentage (e.g., 10 for 10%).**  
**\- discount\_price (decimal, optional): Price after discount.**  
**\- category (object, required): Nested category object. Includes:**  
	**\- name (string)**  
	**\- parent (object, optional): { name: string }**  
**\- stock (int, optional, write-only): Used if no variations are provided.**  
**\- is\_active (boolean, optional): Indicates if the product is available.**  
**\- images (list of image files, optional, write-only): Uploaded product images.**  
**\- variations (list of dicts, optional, write-only): Variations like size/color/stock. Example:**  
	**\[**  
    	**{ "size": "M", "color": "Red", "stock": 10 },**  
    	**{ "size": "L", "color": "Blue", "stock": 5 }**  
	**\]**

**Validation:**  
**\-----------**  
**\- Either \`stock\` or at least one \`variation\` must be provided when creating a product.**  
**\- Automatically calculates total inventory from variations or uses stock.**

**Behavior:**  
**\---------**  
**\- Category is created or retrieved based on name and parent.**  
**\- If stock falls below DEFAULT\_LOW\_STOCK\_THRESHOLD and manufacturer exists, a low stock email is sent.**  
**\- Images and variations are created or updated accordingly.**  
**\- On update, existing images/variations are cleared and replaced if new ones are given.**

**Endpoints:**  
**\----------**

**POST /products/add-product/**  
**\--------------------**  
**Create a new product.**

**Example Request (using stock):**  
**{**  
  **"name": "Shoes",**  
  **"description": "Running shoes",**  
  **"price": 5000,**  
  **"discount\_percent": 20,**  
  **"category": {**  
	**"name": "Footwear",**  
	**"parent": {**  
  	**"name": "Men"**  
	**}**  
  **},**  
  **"stock": 12,**  
  **"images": \[uploaded image files\]**  
**}**

**Example Request (using variations):**  
**{**  
  **"name": "T-Shirt",**  
  **"description": "Comfortable cotton T-shirt",**  
  **"price": 2000,**  
  **"category": {**  
	**"name": "Tops"**  
  **},**  
  **"variations": \[**  
	**{ "size": "S", "color": "Black", "stock": 5 },**  
	**{ "size": "M", "color": "White", "stock": 10 }**  
  **\],**  
  **"images": \[uploaded image files\]**  
**}**

**PATCH /products/update-product/{id}/**  
**\------------------------**  
**Update an existing product. Handles:**  
**\- Category partial update (leaves old data intact if not changed)**  
**\- Update segment of variations or images**  
**\- Update inventory**  
**\- Resetting low stock flag if restocked**

**Low Stock Notification:**  
**\-----------------------**  
**If inventory \<= DEFAULT\_LOW\_STOCK\_THRESHOLD:**  
**\- Email is sent to manufacturer (if available)**  
**\- Example message:**  
	**Subject: Low Stock Alert: {product.name}**  
	**Body:**  
	**Hello {manufacturer.first\_name},**

	**Your product "{product.name}" is low on stock: {inventory} left.**

	**Please restock soon.**

**Errors:**  
**\-------**  
**\- "You must provide either a stock value or at least one variation."**  
  **Raised during creation if both stock and variations are missing.**

**PUT /products/put-product/{id}/**  
**\------------------------**  
**Update an existing product. Handles:**  
**\- Category change**  
**\- Replacing variations or images**  
**\- Adjusting inventory**  
**\- Resetting low stock flag if restocked**

**Low Stock Notification:**  
**\-----------------------**  
**If inventory \<= DEFAULT\_LOW\_STOCK\_THRESHOLD:**  
**\- Email is sent to manufacturer (if available)**  
**\- Example message:**  
	**Subject: Low Stock Alert: {product.name}**  
	**Body:**  
	**Hello {manufacturer.first\_name},**

	**Your product "{product.name}" is low on stock: {inventory} left.**

	**Please restock soon.**

**Errors:**  
**\-------**  
**\- "You must provide either a stock value or at least one variation."**  
  **Raised during creation if both stock and variations are missing.**

**\-------------------------------**  
**🗑 DELETE PRODUCT**  
**\-------------------------------**  
**DELETE /products/delete-product/{id}/**

**Auth: Required (Admin/Manufacturer)**

**Response:**  
**204 No Content**

**\-------------------------------**  
**📄 GET ALL PRODUCTS**  
**\-------------------------------**  
**GET /products/list**

**Public access allowed.**

**Filters (via query params):**  
**\- category**  
**\- name (search)**  
**\- is\_active**  
**\- price\_min, price\_max (if custom filters added)**

**Example:**  
**GET /products/list/?search=iphone**

**Response:**  
**\[**  
  **{**  
	**"id": 1,**  
	**"name": "iPhone 14",**  
	**"description": "...",**  
	**...**  
  **}**  
**\]**

**\-------------------------------**  
**🧪 VALIDATION RULES**  
**\-------------------------------**  
**\- Either \`stock\` or \`variations\` must be present.**  
**\- \`variations\` must be valid JSON string, e.g.:**  
  **'\[{"size": "128GB", "color": "Black", "stock": 5}\]'**  
**\- \`category\` must include name (and optionally parent.name)**  
**\- If category or parent doesn't exist, it is auto-created.**  
**\- Images are optional and will be attached to product if provided.**

**\-------------------------------**  
**🚨 ERROR RESPONSES**  
**\-------------------------------**

**400 Bad Request:**  
**{**  
  **"variations": "Invalid JSON format"**  
**}**

**400 Validation Error:**  
**{**  
  **"non\_field\_errors": \[**  
	**"You must provide either a stock value or at least one variation."**  
  **\]**  
**}**

**\-------------------------------**  
**✅ AUTO CREATED MODELS**  
**\-------------------------------**  
**\- If category (or its parent) doesn't exist, it's created.**  
**\- \`inventory\` is computed automatically from variations or stock.**

**\-------------------------------**  
**📁 EXAMPLE CATEGORY INPUT**  
**\-------------------------------**  
**category \= {**  
  **"name": "Phones",**  
  **"parent": {**  
	**"name": "Electronics"**  
  **}**  
**}**

**Note: parent can be infinite nested. E.g: Electronics\>Home Appliances\>Bluetooth Speaker\>JBL HiFi speaker**  
**\-------------------------------**  
**📁 EXAMPLE VARIATIONS INPUT**  
**\-------------------------------**  
**variations \= \[**  
  **{"size": "128GB", "color": "Black", "stock": 5},**  
  **{"size": "256GB", "color": "White", "stock": 10}**  
**\]**

**\================================**  
**PRODUCT REVIEW API DOCUMENTATION**  
**\================================**

**Endpoint: /products/reviews/**

**Authentication:**  
**\---------------**  
**\- SessionAuthentication and BasicAuthentication**  
**\- Only GET requests can be made anonymously.**  
**\- POST, PATCH, and DELETE require the user to be authenticated.**  
**\- DELETE is restricted to admin users only (user.is\_staff \= True).**

**Supported HTTP Methods:**  
**\-----------------------**  
**\- GET**  
**\- POST**  
**\- PATCH**  
**\- DELETE**

**Pagination:**  
**\-----------**  
**\- Class: ReviewPagination**  
**\- Default page size: 10**  
**\- Query parameter: ?page\_size=\<number\> (max: 100\)**

**\------------------------------------------------------------------------------**  
**GET /products/reviews/?product\_id=\<id\>\&rating=\<rating\>**  
**GET /products/reviews/?review\_id=\<id\>**  
**\------------------------------------------------------------------------------**

**Description:**  
**\- Fetches either a single review (if \`review\_id\` is provided) or a paginated list of reviews for a product (if \`product\_id\` is provided).**  
**\- Optionally filter reviews by rating using \`?rating=5\`.**

**Authentication:**  
**\- Not required**

**Responses:**  
**\- 200 OK: Success, returns review(s) data**  
**\- 400 BAD REQUEST: If neither \`product\_id\` nor \`review\_id\` is provided, or if \`rating\` is invalid**

**\------------------------------------------------------------------------------**  
**POST /products/reviews/?product\_id=\<id\>**  
**\------------------------------------------------------------------------------**

**Description:**  
**\- Creates a new review for a product.**

**Authentication:**  
**\- Required**

**Request Body:**  
**\- JSON containing review fields (handled by \`ProductReviewSerializer\`)**

**Responses:**  
**\- 201 CREATED: Review created successfully**  
**\- 400 BAD REQUEST: Missing or invalid data**

**\------------------------------------------------------------------------------**  
**PATCH /products/reviews/?review\_id=\<id\>**  
**\------------------------------------------------------------------------------**

**Description:**  
**\- Updates an existing review. Partial updates allowed.**

**Authentication:**  
**\- Required**

**Request Body:**  
**\- JSON with fields to update**

**Responses:**  
**\- 200 OK: Review updated**  
**\- 400 BAD REQUEST: Missing \`review\_id\` or invalid data**

**\------------------------------------------------------------------------------**  
**DELETE /products/reviews/?review\_id=\<id\>**  
**\------------------------------------------------------------------------------**

**Description:**  
**\- Deletes a review. Admin-only access.**

**Authentication:**  
**\- Required (admin only)**

**Responses:**  
**\- 204 NO CONTENT: Deleted successfully**  
**\- 400 BAD REQUEST: Missing \`review\_id\`**  
**\- 403 FORBIDDEN: Non-admin user**  
**\------------------------------------------------------------------------------**

**Query Parameters Summary:**  
**\--------------------------**  
**\- product\_id (int): ID of the product to filter or create a review**  
**\- review\_id (int): ID of the review to fetch, update, or delete**  
**\- rating (int, optional): Used with GET \+ product\_id to filter by rating**  
**\- page (int, optional): Used with pagination**  
**\- page\_size (int, optional): Number of results per page (max 100\)**

| Method | URL | Description |
| ----- | ----- | ----- |
| **GET** | **`/products/review-list/<product_id>/reviews/`** | **List reviews for a product (with pagination and optional `?rating=` filter)** |
| **POST** | **`/products/review-list/<product_id>/reviews/`** | **Create a new review (authenticated user only)** |
| **GET** | **`/products/reviews-update/<review_id>/`** | **Retrieve single review** |
| **PATCH** | **`/products/reviews-update/<review_id>/`** | **Update a review (authenticated user only)** |
| **DELETE** | **`/products/reviews-update/<review_id>/`** | **Delete a review (admin only)** |

