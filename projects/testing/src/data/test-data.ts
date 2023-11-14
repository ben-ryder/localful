import {TestUserEntity} from "../schemas/test-user.dto.js";


export const testEnvironmentVars = {
  ACCESS_TOKEN_SECRET: "ivfbaklhfvuaiebgkjearbgoebrgkjebgiskbgnbgihsbdkgbodjbgbkgjfddfd",
  ACCESS_TOKEN_EXPIRY: "7h",
  REFRESH_TOKEN_SECRET: "jvbfhru9h9iuebukhreuirbghkebrgouaerkbjgbfousfashkbgrieaobferge",
  REFRESH_TOKEN_EXPIRY: "7 days",
  PASSWORD_RESET_SECRET: "kjbzdorgbdguidrbgigibiubxfvigzsebxfzkhkzfvbizdbvjkbdvibhbvfzd",
  PASSWORD_RESET_EXPIRY: "10 mins",
  APP_REGISTRATION_ENABLED: true
}


/**
 * Test users.
 * These can be used to for authentication, access control testing etc.
 *
 * THIS IS THE ONLY PLACE WITH SOME COUPLING BETWEEN THE FRONT AND THE BACK END
 * IMPLEMENTATIONS AS THE USER PASSWORD AND SERVER PASSWORD ARE DIFFERENT, SO
 * CONSUMERS OF THIS DATA MUST DECIDE WHICH ONE THEY NEED TO USE FOR TESTING.
 */
export const testUsers: readonly TestUserEntity[] = Object.freeze([
  {
    id: "90938b63-3b14-4b18-8185-b3cfa5de2d6a",
    displayName: "test1",
    email: "test1@example.com",
    password: "password",
    role: 'user',
    isVerified: true,
    createdAt: "2022-07-11T18:17:43.784Z",
    updatedAt: "2022-07-11T18:20:32.482Z",
    passwordHash: "$2a$12$BjTFHAACFkJrcA0I2ylIDeBGl1hiQDB6zlqHoLWzivzy7MTvAVWbu",
    serverPassword: "8375219b5264274e46ee35e4bed1a826ec8733892b3d0cbcf27af56140d30f0c4ce2b5b87d1b8bccd460373f6b07e561819c1060d87e0a6ed8086b5cda1b3e1",
    masterEncryptionKey: "5ffbb0d81831e8cae5bb2b1e66aadf19626ab75b8858d6f1ddbc377533cd33c5b22ca7b23bcfb8012a27e7133df3a83676ac6208142fff92c3eace80ce79eca1",
    protectedEncryptionKey: "U2FsdGVkX18JFA9xwYGFCVQ98o4/m+vw4iK9g/8Vz4GuT6W8ULf86MBi+0LzgYfD6GY0FzZKANqTu7Zt9aVc5zeR3hTR9N2OyRWHPEFBLl/kGoZ+4NY3M4lgv00woKL/Eh6vMDxUsl2hLpCC8hsEd1wwpa73dckgnzp0E2sKJr/zAJwQhMDPqLo/ViQWODcQBU5Yrhji/5hfSGQrEVIH7w==",
  },
  {
    id: "73852037-a8fc-42ec-bf8f-9e7314e1eabc",
    displayName: "test2",
    email: "test2@example.com",
    password: "amazingpassword42",
    role: 'user',
    isVerified: false,
    createdAt: "2022-07-11T18:17:43.784Z",
    updatedAt: "2022-07-11T18:17:43.784Z",
    passwordHash: "$2a$12$WPnOyfns.Co0s/DIJh/DdeMv8bg4IYTsPEFo/YPdaBEKPQnT/uNMK",
    serverPassword: "abb82f12718ba15ce92ed9e8951b2a751cc6de2f8d85dcb820cf3d2ce5d87a4bd7989123f73eebd7c7d949761d8ddac0b0062751de1fc3058a5a2143a1abb08",
    masterEncryptionKey: "91cb2c6bda94379a7806592ca1955b9118a8e2cd59a6c772e163ace02baef9ec1ada638fae508997321fc9e736dfa41017990b1d121d88a3baabcf2c9ff79b76",
    protectedEncryptionKey: "U2FsdGVkX1/cRByjThbEEe1Mh8/fmBf9vFRqlNJEjrD0Q6m0+u0q1MXehrmRaZVi2rcVFWmgSeOo45QKD7u/Pww+RhFeGPKAMGI0HXi7AcV506rgWeDYElkkJE/k7zRAmQtMJraSbMF6KhZCseY3FvvRx/JmomEjtXww4dr70rWZ43u7RKG/JJhNotmw/Dw4pYS3vV1e+KpTHNpPIwW/5A==",
  },
  {
    id: "98f4cb22-7815-4785-b659-3285fb06dacf",
    displayName: "test3",
    email: "test3@example.com",
    password: "amazingpassword42",
    role: 'admin',
    isVerified: true,
    createdAt: "2022-07-11 20:15:20.301649",
    updatedAt: "2022-07-11 20:34:12.274037",
    passwordHash: "$2a$12$l9N5AAFSrCG0/3e/NkBfIe0ZIMZsqs8jpA2H4ggS.wn.dPSvm/BG6",
    serverPassword: "c12839374d464214f64e9ce2d7f9eb93cf8f8fd66cea4d448df5dc025f316bc666b0813ec5c4110389dabb1bd68e13e14bb2c3d75877322c06200c8c5515a42",
    masterEncryptionKey: "d55ddf4b314b377b75685d76aea76856cdfbcf16d1e86d19f9d626cf1d172833598966b5667c7d94fe657e8ba725f4dbba54518e6d9befcf2ebb7c41e73ab7f8",
    protectedEncryptionKey: "U2FsdGVkX1/QqfUbZJGc9icpxOdL2j5/wcdeUVzrcva/3P1Eb1zYbzQveq/Uq65EdyPYiKDdCynITLzFfJyAMCZMcneCUt+YH2Yw1s1+eOLXUOri+pq4AyPYA2HyqBMgJFeNR9s0tkRQCkJ/o8/lHjQ0zcOMEB1cxhK/4+i1KZnwweGKo7n1eqG39vQ1HFc5Edz07mfO0hvm6M7cIgzTIg==",
  }
]);
