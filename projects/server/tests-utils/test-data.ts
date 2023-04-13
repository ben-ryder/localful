/**
 * Test Data
 * This data is added to the database during test data seeding and can be used in testing.
 */
import {ChangeInternalDatabaseDto, ProfileDto} from "@ben-ryder/lfb-common";

export const testProfiles: readonly ProfileDto[] = Object.freeze([
  {
    userId: "90938b63-3b14-4b18-8185-b3cfa5de2d6a",
    //encryptionKey: "5ffbb0d81831e8cae5bb2b1e66aadf19626ab75b8858d6f1ddbc377533cd33c5b22ca7b23bcfb8012a27e7133df3a83676ac6208142fff92c3eace80ce79eca1",
    encryptionSecret: "U2FsdGVkX18JFA9xwYGFCVQ98o4/m+vw4iK9g/8Vz4GuT6W8ULf86MBi+0LzgYfD6GY0FzZKANqTu7Zt9aVc5zeR3hTR9N2OyRWHPEFBLl/kGoZ+4NY3M4lgv00woKL/Eh6vMDxUsl2hLpCC8hsEd1wwpa73dckgnzp0E2sKJr/zAJwQhMDPqLo/ViQWODcQBU5Yrhji/5hfSGQrEVIH7w==",
    createdAt: "2022-07-11T18:17:43.784Z",
    updatedAt: "2022-07-11T18:20:32.482Z"
  },
  {
    userId: "73852037-a8fc-42ec-bf8f-9e7314e1eabc",
    //encryptionKey: "91cb2c6bda94379a7806592ca1955b9118a8e2cd59a6c772e163ace02baef9ec1ada638fae508997321fc9e736dfa41017990b1d121d88a3baabcf2c9ff79b76",
    encryptionSecret: "U2FsdGVkX1/cRByjThbEEe1Mh8/fmBf9vFRqlNJEjrD0Q6m0+u0q1MXehrmRaZVi2rcVFWmgSeOo45QKD7u/Pww+RhFeGPKAMGI0HXi7AcV506rgWeDYElkkJE/k7zRAmQtMJraSbMF6KhZCseY3FvvRx/JmomEjtXww4dr70rWZ43u7RKG/JJhNotmw/Dw4pYS3vV1e+KpTHNpPIwW/5A==",
    createdAt: "2022-07-11T18:17:43.784Z",
    updatedAt: "2022-07-11T18:17:43.784Z"
  },
  {
    userId: "98f4cb22-7815-4785-b659-3285fb06dacf",
    //encryptionKey: "d55ddf4b314b377b75685d76aea76856cdfbcf16d1e86d19f9d626cf1d172833598966b5667c7d94fe657e8ba725f4dbba54518e6d9befcf2ebb7c41e73ab7f8",
    encryptionSecret: "U2FsdGVkX1/QqfUbZJGc9icpxOdL2j5/wcdeUVzrcva/3P1Eb1zYbzQveq/Uq65EdyPYiKDdCynITLzFfJyAMCZMcneCUt+YH2Yw1s1+eOLXUOri+pq4AyPYA2HyqBMgJFeNR9s0tkRQCkJ/o8/lHjQ0zcOMEB1cxhK/4+i1KZnwweGKo7n1eqG39vQ1HFc5Edz07mfO0hvm6M7cIgzTIg==",
    createdAt: "2022-07-11 20:15:20.301649",
    updatedAt: "2022-07-11 20:34:12.274037"
  },
]);

export const testChanges: readonly ChangeInternalDatabaseDto[] = Object.freeze([
  // User 0 Changes
  {
    id: "dd045c93-d3e9-4c00-b2e8-712d15bf7962",
    user_id: testProfiles[0].userId,
    data: "user 0 change 0"
  },
  {
    id: "bcf0f4de-4c4b-4b45-9e9f-1f2848803b93",
    user_id: testProfiles[0].userId,
    data: "user 0 change 1"
  },
  {
    id: "b06f6f3e-0098-4514-8dab-f162f6edc36a",
    user_id: testProfiles[0].userId,
    data: "user 0 change 2"
  },
  {
    id: "20926f9f-3671-470a-aec6-004eb1204d21",
    user_id: testProfiles[0].userId,
    data: "user 0 change 3"
  },
  {
    id: "38a7b58e-a105-459b-8c01-6c8376bd17f4",
    user_id: testProfiles[0].userId,
    data: "user 0 change 4"
  },
  // User 1 Changes
  {
    id: "836f7b3b-c3bc-4860-bb1b-4bd24491023b",
    user_id: testProfiles[1].userId,
    data: "user 1 change 0"
  },
  {
    id: "11268286-0485-44da-8aa7-4f7d9da315f8",
    user_id: testProfiles[1].userId,
    data: "user 1 change 1"
  },
  {
    id: "2c150624-1cdc-46ef-b091-3f2496e3ecc2",
    user_id: testProfiles[1].userId,
    data: "user 1 change 2"
  },
]);
