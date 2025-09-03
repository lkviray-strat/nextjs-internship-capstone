import {
  capitalizeWords,
  enumToWord,
  extractNonNullableFrom,
  getColorFromHash,
  getContent,
  getTimeAgo,
  getTimeDistanceRaw,
  getUserInitials,
  hasTrueValue,
  sentenceCase,
  snakeToTitleCase,
  stringToHash,
} from "@/src/lib/utils";

describe("Utils Tests", () => {
  describe("String formatting", () => {
    test("enumToWord should format ENUM_CASE to 'Enum Case'", () => {
      expect(enumToWord("PROJECT_STATUS")).toBe("Project Status");
    });

    test("sentenceCase should capitalize first letter", () => {
      expect(sentenceCase("hello WORLD")).toBe("Hello world");
    });

    test("snakeToTitleCase should convert snake_case to Title Case", () => {
      expect(snakeToTitleCase("task_assigned")).toBe("Task Assigned");
    });

    test("capitalizeWords should capitalize each word", () => {
      expect(capitalizeWords("hello world")).toBe("Hello World");
    });
  });

  describe("Date helpers", () => {
    const now = new Date();

    test("getTimeAgo returns a string ending in 'ago'", () => {
      const oneMinuteAgo = new Date(now.getTime() - 60 * 1000);
      expect(getTimeAgo(oneMinuteAgo)).toMatch(/ago$/);
    });

    test("getTimeDistanceRaw returns a relative time", () => {
      const oneMinuteAgo = new Date(now.getTime() - 60 * 1000);
      expect(getTimeDistanceRaw(oneMinuteAgo)).toBeTruthy();
    });
  });

  describe("User helpers", () => {
    test("getUserInitials returns initials", () => {
      expect(getUserInitials("John", "Doe")).toBe("JD");
      expect(getUserInitials("John")).toBe("J");
    });
  });

  describe("Array helpers", () => {
    test("extractNonNullableFrom filters out null/undefined", () => {
      const arr = [1, null, 2, undefined, 3];
      expect(extractNonNullableFrom(arr)).toEqual([1, 2, 3]);
    });
  });

  describe("Object helpers", () => {
    test("hasTrueValue returns true if at least one true boolean exists", () => {
      expect(hasTrueValue({ a: false, b: true })).toBe(true);
      expect(hasTrueValue({ a: false, b: false })).toBe(false);
    });
  });

  describe("Hash and color", () => {
    test("stringToHash generates consistent positive number", () => {
      const hash1 = stringToHash("hello");
      const hash2 = stringToHash("hello");
      expect(hash1).toBe(hash2);
      expect(hash1).toBeGreaterThanOrEqual(0);
    });

    test("getColorFromHash returns hsl string", () => {
      const hash = stringToHash("hello");
      expect(getColorFromHash(hash)).toMatch(/^hsl\(/);
    });
  });

  describe("Content extraction", () => {
    test("getContent returns correct initials from content", () => {
      expect(getContent("hello_world")).toBe("HW");
      expect(getContent("single")).toBe("SI");
    });
  });
});
