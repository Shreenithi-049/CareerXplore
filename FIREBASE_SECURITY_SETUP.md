# Firebase Security Rules Setup

## Realtime Database Rules

### How to Apply:

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Navigate to **Realtime Database** → **Rules** tab
4. Copy and paste the rules from `firebase-database-rules.json`
5. Click **Publish**

### Rules Explanation:

```json
{
  "rules": {
    "users": {
      "$uid": {
        ".read": "$uid === auth.uid",
        ".write": "$uid === auth.uid",
        "favorites": {
          ".read": "$uid === auth.uid",
          ".write": "$uid === auth.uid"
        }
      }
    }
  }
}
```

**Security Features:**
- ✅ Users can only read their own data
- ✅ Users can only write to their own data
- ✅ Favorites are protected under user's UID
- ✅ Prevents unauthorized access to other users' profiles
- ✅ Prevents unauthorized modification of data

### Data Structure Protected:
```
users/
  {uid}/
    - fullName
    - email
    - skills
    - interests
    - education
    - favorites/
      - careers/
      - internships/
```

## Testing Security Rules:

### Valid Operations:
- ✅ User can read: `/users/{their_uid}`
- ✅ User can write: `/users/{their_uid}/skills`
- ✅ User can read: `/users/{their_uid}/favorites/careers`

### Blocked Operations:
- ❌ User cannot read: `/users/{other_uid}`
- ❌ User cannot write: `/users/{other_uid}/favorites`
- ❌ Unauthenticated users cannot access any data

## Important Notes:

1. **Authentication Required**: All operations require user to be authenticated
2. **UID Matching**: Users can only access data where the UID matches their auth.uid
3. **No Public Data**: No data is publicly readable or writable
4. **Favorites Protection**: Favorites are nested under user data with same security rules

## Deployment:

After updating rules in Firebase Console, they take effect immediately. No app restart required.
