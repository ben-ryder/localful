/*
As the profile data is a generic json object types only need to assert that data is standard JSON.
Source: https://stackoverflow.com/a/59647842
 */
type Primitive =
  | bigint
  | boolean
  | null
  | number
  | string
  | symbol
  | undefined;

type JSONValue = Primitive | JSONObject | JSONArray;

interface JSONArray extends Array<JSONValue> { }

export interface JSONObject {
  [key: string]: JSONValue;
}

export interface InternalDatabaseProfileDto {
  userId: string;
  data: JSONObject
}
