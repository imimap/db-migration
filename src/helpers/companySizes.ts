const small = "small";
const medium = "medium";
const big = "big";

export const companySizes = {
  [big]: ">= 250 employees",
  [medium]: "< 250 employees",
  [small]: "<50 employees",
};

export function getCompanySize(numberOfEmployees: number): string {
  if (numberOfEmployees < 50)
    return small;
  else if (numberOfEmployees < 250)
    return medium;
  else
    return big;
}
