// import * as jose from 'jose';

// const supabaseJwtSecret = new TextEncoder().encode(
//   process.env.SUPABASE_JWT_SECRET!,
// );

// export function signSupabaseJWT(payload: Record<string, any>) {
//   return new jose.SignJWT(payload)
//     .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
//     .setExpirationTime(payload.exp)
//     .sign(supabaseJwtSecret);
// }
