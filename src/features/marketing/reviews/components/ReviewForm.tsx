import { Button, HStack, Icon, Text, VStack } from "@chakra-ui/react";
import { Star } from "lucide-react";
import { useController, type Control } from "react-hook-form";

import { TextareaInput } from "@/lib/components/Form/fields/TextareaInput";
import { TextInput } from "@/lib/components/Form/fields/TextInput";
import { useFormContextSelector } from "@/lib/components/Form/form-context";
import { FormProvider } from "@/lib/components/Form/FormProvider";
import { useForm } from "@/lib/components/Form/use-form";
import { useTranslations } from "@/lib/i18n/use-transations";
import { useColorModeValue } from "@/lib/theme/use-color-mode";

import {
  useSubmitReview,
  type SubmitReviewPayload,
} from "../application/use-submit-review";

export interface ReviewFormValues {
  rating: number;
  title: string;
  comment: string;
}

interface IProps {
  productId: string;
  defaultValues: ReviewFormValues;
  onSuccess: () => void;
}

const ReviewForm = ({ productId, defaultValues, onSuccess }: IProps) => {
  const t = useTranslations("features.marketing.reviews.form");
  const tShared = useTranslations("shared.form");
  const { submitReview, isPending } = useSubmitReview(productId);

  const form = useForm<ReviewFormValues>({
    defaultValues,
    configuration: { autoValidation: true, size: "md" },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    const payload: SubmitReviewPayload = {
      rating: values.rating,
      title: values.title,
      comment: values.comment,
    };
    const success = await submitReview(payload);
    if (success) onSuccess();
  });

  return (
    <FormProvider {...form}>
      <form onSubmit={onSubmit} noValidate>
        <VStack gap={4} align="stretch">
          <RatingField label={t("rating")} />
          <TextInput
            name="title"
            label={t("title")}
            placeholder={t("title-placeholder")}
            register={{
              required: { value: true, message: tShared("required") },
              maxLength: { value: 120, message: t("title-too-long") },
            }}
          />
          <TextareaInput
            name="comment"
            label={t("comment")}
            placeholder={t("comment-placeholder")}
            register={{
              required: { value: true, message: tShared("required") },
              maxLength: { value: 2000, message: t("comment-too-long") },
            }}
          />
          <Button
            type="submit"
            colorPalette="blue"
            w="100%"
            loading={isPending}
          >
            {t("submit")}
          </Button>
        </VStack>
      </form>
    </FormProvider>
  );
};

interface RatingFieldProps {
  label: string;
}

const RatingField = ({ label }: RatingFieldProps) => {
  const control = useFormContextSelector<
    Control<ReviewFormValues>,
    ReviewFormValues
  >((state) => state.control);
  const idleStar = useColorModeValue("gray.300", "gray.600");
  const activeStar = useColorModeValue("gray.700", "gray.300");

  const {
    field,
    fieldState: { error },
  } = useController<ReviewFormValues, "rating">({
    name: "rating",
    control,
    rules: {
      required: { value: true, message: "Rating is required" },
      min: { value: 1, message: "Rating must be between 1 and 5" },
      max: { value: 5, message: "Rating must be between 1 and 5" },
    },
  });

  const value = typeof field.value === "number" ? field.value : 0;

  return (
    <VStack align="flex-start" gap={1}>
      <Text fontSize="sm" fontWeight="medium">
        {label}
      </Text>
      <HStack gap={1}>
        {[1, 2, 3, 4, 5].map((n) => (
          <Icon
            key={n}
            color={value >= n ? activeStar : idleStar}
            boxSize={6}
            cursor="pointer"
            aria-label={`${n}`}
            role="button"
            onClick={() => field.onChange(n)}
          >
            <Star fill="currentColor" />
          </Icon>
        ))}
      </HStack>
      {error?.message && (
        <Text fontSize="sm" color="red.500">
          {error.message}
        </Text>
      )}
    </VStack>
  );
};

export { ReviewForm };
