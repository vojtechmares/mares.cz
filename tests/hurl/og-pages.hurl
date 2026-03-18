# Dynamic page OG images — Czech

GET {{base_url}}/obchodni-spoluprace/card.png
HTTP 200
[Asserts]
header "content-type" contains "image/png"

GET {{base_url}}/projekty/card.png
HTTP 200
[Asserts]
header "content-type" contains "image/png"

GET {{base_url}}/skoleni-na-miru/card.png
HTTP 200
[Asserts]
header "content-type" contains "image/png"

GET {{base_url}}/zasady-pouzivani-cookies/card.png
HTTP 200
[Asserts]
header "content-type" contains "image/png"

# Dynamic page OG images — English

GET {{base_url}}/en/projects/card.png
HTTP 200
[Asserts]
header "content-type" contains "image/png"

GET {{base_url}}/en/custom-training/card.png
HTTP 200
[Asserts]
header "content-type" contains "image/png"

GET {{base_url}}/en/business-cooperation/card.png
HTTP 200
[Asserts]
header "content-type" contains "image/png"

GET {{base_url}}/en/cookie-policy/card.png
HTTP 200
[Asserts]
header "content-type" contains "image/png"
