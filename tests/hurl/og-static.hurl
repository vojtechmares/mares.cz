# Static page OG images

GET {{base_url}}/card.png
HTTP 200
[Asserts]
header "content-type" contains "image/png"

GET {{base_url}}/en/card.png
HTTP 200
[Asserts]
header "content-type" contains "image/png"

GET {{base_url}}/prednasky/card.png
HTTP 200
[Asserts]
header "content-type" contains "image/png"

GET {{base_url}}/en/talks/card.png
HTTP 200
[Asserts]
header "content-type" contains "image/png"

GET {{base_url}}/sluzby/card.png
HTTP 200
[Asserts]
header "content-type" contains "image/png"

GET {{base_url}}/en/services/card.png
HTTP 200
[Asserts]
header "content-type" contains "image/png"

GET {{base_url}}/skoleni/verejne-terminy/card.png
HTTP 200
[Asserts]
header "content-type" contains "image/png"

GET {{base_url}}/en/training/public-sessions/card.png
HTTP 200
[Asserts]
header "content-type" contains "image/png"
