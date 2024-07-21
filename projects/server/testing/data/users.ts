import {TestUserEntity} from "../types/test-user.dto";

/**
 * Test users.
 * These can be used to for any testing, and will be seeded before every test run.
 *
 * THIS IS THE ONLY PLACE WITH SOME COUPLING BETWEEN THE FRONT AND THE BACK END
 * IMPLEMENTATIONS AS THE USER PASSWORD AND SERVER PASSWORD ARE DIFFERENT, SO
 * CONSUMERS OF THIS DATA MUST DECIDE WHICH ONE THEY NEED TO USE FOR TESTING.
 *
 */
export const testUser1: TestUserEntity = Object.freeze({
  id: "90938b63-3b14-4b18-8185-b3cfa5de2d6a",
  email: "testUser1@example.com",
  displayName: "testUser1",
  password: "password1234!",
  verifiedAt: "2022-07-11T18:20:32.482Z",
  firstVerifiedAt: "2022-07-11T18:20:32.482Z",
  role: "user",
  createdAt: "2022-07-11T18:17:43.784Z",
  updatedAt: "2022-07-11T18:20:32.482Z",
  passwordHash: "$2a$12$BjTFHAACFkJrcA0I2ylIDeBGl1hiQDB6zlqHoLWzivzy7MTvAVWbu",
  serverPassword: "8375219b5264274e46ee35e4bed1a826ec8733892b3d0cbcf27af56140d30f0c4ce2b5b87d1b8bccd460373f6b07e561819c1060d87e0a6ed8086b5cda1b3e1",
})

export const testUser2Unverified: TestUserEntity = Object.freeze({
  id: "73852037-a8fc-42ec-bf8f-9e7314e1eabc",
  email: "testUser2Unverified@example.com",
  displayName: "testUser2Unverified",
  password: "amazingpassword42",
  verifiedAt: null,
  firstVerifiedAt: null,
  role: "user",
  createdAt: "2022-07-11T18:17:43.784Z",
  updatedAt: "2022-07-11T18:17:43.784Z",
  passwordHash: "$2a$12$WPnOyfns.Co0s/DIJh/DdeMv8bg4IYTsPEFo/YPdaBEKPQnT/uNMK",
  serverPassword: "abb82f12718ba15ce92ed9e8951b2a751cc6de2f8d85dcb820cf3d2ce5d87a4bd7989123f73eebd7c7d949761d8ddac0b0062751de1fc3058a5a2143a1abb08",
})

export const testAdminUser1: TestUserEntity = Object.freeze({
  id: "98f4cb22-7815-4785-b659-3285fb06dacf",
  email: "testAdminUser1@example.com",
  displayName: "testAdminUser1",
  password: "amazingpassword42",
  verifiedAt: "2022-07-11T18:20:32.482Z",
  firstVerifiedAt: "2022-07-11T18:20:32.482Z",
  role: "admin",
  createdAt: "2022-07-11 20:15:20.301649",
  updatedAt: "2022-07-11 20:34:12.274037",
  passwordHash: "$2a$12$l9N5AAFSrCG0/3e/NkBfIe0ZIMZsqs8jpA2H4ggS.wn.dPSvm/BG6",
  serverPassword: "c12839374d464214f64e9ce2d7f9eb93cf8f8fd66cea4d448df5dc025f316bc666b0813ec5c4110389dabb1bd68e13e14bb2c3d75877322c06200c8c5515a42",
})

export const testAdminUser2Unverified: TestUserEntity = Object.freeze({
  id: "0e6d936b-e659-4c7a-99d5-a911dca14d33",
  email: "testAdminUser2Unverified@example.com",
  displayName: "testAdminUser2Unverified",
  password: "amazingpassword42",
  verifiedAt: null,
  firstVerifiedAt: null,
  role: "admin",
  createdAt: "2022-07-11 20:15:20.301649",
  updatedAt: "2022-07-11 20:34:12.274037",
  passwordHash: "$2a$12$l9N5AAFSrCG0/3e/NkBfIe0ZIMZsqs8jpA2H4ggS.wn.dPSvm/BG6",
  serverPassword: "c12839374d464214f64e9ce2d7f9eb93cf8f8fd66cea4d448df5dc025f316bc666b0813ec5c4110389dabb1bd68e13e14bb2c3d75877322c06200c8c5515a42",
})

/**
 * Example users.
 * These can be used for user creation tests etc.
 * They will not be seeded before every test, but will be cleaned up if found.
 *
 * THIS IS THE ONLY PLACE WITH SOME COUPLING BETWEEN THE FRONT AND THE BACK END
 * IMPLEMENTATIONS AS THE USER PASSWORD AND SERVER PASSWORD ARE DIFFERENT, SO
 * CONSUMERS OF THIS DATA MUST DECIDE WHICH ONE THEY NEED TO USE FOR TESTING.
 */
export const exampleUser1 = Object.freeze({
  email: "exampleUser1@example.com",
  displayName: "exampleUser1",
  password: "password1234!",
})
