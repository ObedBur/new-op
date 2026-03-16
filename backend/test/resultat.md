HTTP/1.1 200 OK
X-Powered-By: Express
Vary: Origin
Access-Control-Allow-Credentials: true
Content-Type: application/json; charset=utf-8
Content-Length: 86
ETag: W/"56-bWlqFKcqtFVx43ZyMwBIEA1/hyM"
Date: Sun, 15 Feb 2026 19:06:36 GMT
Connection: close

{
  "success": true,
  "message": "Test users cleared",
  "timestamp": "2026-02-15T19:06:36.575Z"
}

// 
HTTP/1.1 201 Created
X-Powered-By: Express
Vary: Origin
Access-Control-Allow-Credentials: true
Content-Type: application/json; charset=utf-8
Content-Length: 85
ETag: W/"55-c2pKZr4e7ghiknLpGOhk1fORQMM"
Date: Sun, 15 Feb 2026 19:08:38 GMT
Connection: close

{
  "success": true,
  "message": "Registration successful. Verify OTP.",
  "requiresKyc": false
}


[Nest] 17248  - 02/15/2026, 9:08:38 PM   DEBUG [OtpService] [DEV OTP] user1@gmail.com -> 389947
[Nest] 17248  - 02/15/2026, 9:08:39 PM   ERROR [EmailService] Failed to send email to user1@gmail.com: getaddrinfo ENOTFOUND api.brevo.com

//

HTTP/1.1 200 OK
X-Powered-By: Express
Vary: Origin
Access-Control-Allow-Credentials: true
X-RateLimit-Limit-auth: 5
X-RateLimit-Remaining-auth: 4
X-RateLimit-Reset-auth: 1
Content-Type: application/json; charset=utf-8
Content-Length: 41
ETag: W/"29-F+9Ktby2eNPcnTura4cgaBAjDn0"
Date: Sun, 15 Feb 2026 19:09:52 GMT
Connection: close

{
  "success": true,
  "message": "New OTP sent"
} 

[Nest] 17248  - 02/15/2026, 9:09:52 PM   DEBUG [OtpService] [DEV OTP] user1@gmail.com -> 365733
[Nest] 17248  - 02/15/2026, 9:09:52 PM   ERROR [EmailService] Failed to send email to user1@gmail.com: getaddrinfo ENOTFOUND api.brevo.com

//
HTTP/1.1 200 OK
X-Powered-By: Express
Vary: Origin
Access-Control-Allow-Credentials: true
X-RateLimit-Limit-auth: 5
X-RateLimit-Remaining-auth: 4
X-RateLimit-Reset-auth: 1
Content-Type: application/json; charset=utf-8
Content-Length: 58
ETag: W/"3a-za2eoVbnkmh4IKLUs/dQa8kd1gI"
Date: Sun, 15 Feb 2026 19:10:32 GMT
Connection: close

{
  "success": true,
  "message": "Account verified successfully"
} 

//

HTTP/1.1 200 OK
X-Powered-By: Express
Vary: Origin
Access-Control-Allow-Credentials: true
X-RateLimit-Limit-auth: 5
X-RateLimit-Remaining-auth: 4
X-RateLimit-Reset-auth: 1
Content-Type: application/json; charset=utf-8
Content-Length: 844
ETag: W/"34c-CksqvpG9lVmK06QsJfDobZE3TLY"
Date: Sun, 15 Feb 2026 19:10:56 GMT
Connection: close

{
  "success": true,
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI3NWRlY2NmNy01ZWVkLTQzMDgtYTVmMi03OTI2ODdhMTc0NGIiLCJlbWFpbCI6InVzZXIxQGdtYWlsLmNvbSIsInJvbGUiOiJDTElFTlQiLCJreWNTdGF0dXMiOiJOT1RfUkVRVUlSRUQiLCJpYXQiOjE3NzExODI2NTYsImV4cCI6MTc3MTE4NjI1Nn0.U0HMrZtMR--puQdPYsqIE19yPgB-CwntMNOKMSPFQg0",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI3NWRlY2NmNy01ZWVkLTQzMDgtYTVmMi03OTI2ODdhMTc0NGIiLCJlbWFpbCI6InVzZXIxQGdtYWlsLmNvbSIsInJvbGUiOiJDTElFTlQiLCJreWNTdGF0dXMiOiJOT1RfUkVRVUlSRUQiLCJqdGkiOiJlYjJjZDY2NzAwMTEyMDQ1ZDI0NjQ3NWUxMzc5OTZmMCIsImlhdCI6MTc3MTE4MjY1NiwiZXhwIjoxNzcxNzg3NDU2fQ.blciYsVyWHCrbtAtkRAHpvieMPN8-ZARXupbbjYzhso",
  "user": {
    "id": "75deccf7-5eed-4308-a5f2-792687a1744b",
    "email": "user1@gmail.com",
    "fullName": "Test Panafricain",
    "role": "CLIENT",
    "trustScore": 90,
    "city": "Goma",
    "country": "RD Congo"
  }
} 

[Nest] 17248  - 02/15/2026, 9:10:56 PM   DEBUG [TokenService] Refresh token saved for user 75deccf7-5eed-4308-a5f2-792687a1744b

HTTP/1.1 200 OK
X-Powered-By: Express
Vary: Origin
Access-Control-Allow-Credentials: true
X-RateLimit-Limit-auth: 5
X-RateLimit-Remaining-auth: 4
X-RateLimit-Reset-auth: 1
Content-Type: application/json; charset=utf-8
Content-Length: 16
ETag: W/"10-oV4hJxRVSENxc/wX8+mA4/Pe4tA"
Date: Sun, 15 Feb 2026 19:11:17 GMT
Connection: close

{
  "success": true
} 


[Nest] 17248  - 02/15/2026, 9:11:17 PM   DEBUG [AuthService] [DEV RESET TOKEN] user1@gmail.com -> d1683c94d23aa2a69c1f5a9becea894ba6666f7323f7e58b5c913f72a7a1f748
[Nest] 17248  - 02/15/2026, 9:11:17 PM   ERROR [EmailService] Failed to send reset email to user1@gmail.com: getaddrinfo ENOTFOUND api.brevo.com

HTTP/1.1 200 OK
X-Powered-By: Express
Vary: Origin
Access-Control-Allow-Credentials: true
Content-Type: application/json; charset=utf-8
Content-Length: 54
ETag: W/"36-DmkosvLTnG1+sVupJ33Sk0MDofI"
Date: Sun, 15 Feb 2026 19:13:19 GMT
Connection: close

{
  "success": true,
  "message": "Password reset successful"
}

[Nest] 17248  - 02/15/2026, 9:11:17 PM   ERROR [EmailService] Failed to send reset email to user1@gmail.com: getaddrinfo ENOTFOUND api.brevo.com
[Nest] 17248  - 02/15/2026, 9:13:19 PM   DEBUG [TokenService] 1 tokens revoked for user 75deccf7-5eed-4308-a5f2-792687a1744b