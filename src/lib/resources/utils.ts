// Decode the single choice questions that are in the form
// as like
// What is the type of your house?
// 1 : Private
// 2 : Public

export const decodeSingleChoice = <T extends Record<string, string>>(
  value: any,
  choices: T,
): string => {
  try {
    return choices[value];
  } catch (e) {
    return value as string;
  }
};

// Decode multiple choice questions like
// Select which which facilites do you have?
// '1 2 3' to be decoded to ["Radio", "Television", "Computer"]

export const decodeMultipleChoices = <T extends Record<string, string>>(
  value: string,
  choices: T,
): string[] | undefined => {
  try {
    if(!value || value?.trim() == "") return undefined;
    const splitUserChoices = value?.split(" ") ?? [];
    const mappedUserChoices = splitUserChoices.map((choice) =>
      decodeSingleChoice(choice as keyof T, choices),
    );
    return mappedUserChoices;
  } catch (e) {
    console.log(value, choices, e);
    return undefined;
  }
};
