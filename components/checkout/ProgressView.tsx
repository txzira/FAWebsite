import { FormCol75 } from "../FormComponents";
import { HorizontalDivider } from "../GeneralComponents";

export function ProgressView({ shippingFormValues, step, setStep, shippingOptionLabel }) {
  const shipAddressHtml = (
    <span>
      {`${shippingFormValues.street}, `}
      {shippingFormValues.street_2 ? `${shippingFormValues.street_2}, ` : ""}
      {`${shippingFormValues.city} ${shippingFormValues.subdivision} ${shippingFormValues.postalCode}, ${shippingFormValues.country}`}
    </span>
  );

  return (
    <div className="block border rounded-lg border-black w-full p-3 mt-20">
      <FormCol75>
        {step >= 1 && (
          <>
            <div className="flex w-full justify-between">
              <div>
                <label className="text-xl">Contact&nbsp;</label>
                <span>{shippingFormValues.email}</span>
              </div>
              <span onClick={() => setStep(0)}>change</span>
            </div>
            <HorizontalDivider />
            <div className="flex w-full justify-between">
              <div>
                <label className="text-xl">Ship To&nbsp;</label>
                {shipAddressHtml}
              </div>
              <span onClick={() => setStep(0)}>change</span>
            </div>
          </>
        )}
        {step >= 2 && (
          <>
            <HorizontalDivider />
            <div className="flex w-full justify-between">
              <div>
                <label className="text-xl">Shipping&nbsp;</label>
                <span>{shippingOptionLabel}</span>
              </div>
              <span onClick={() => setStep(1)}>change</span>
            </div>
          </>
        )}
      </FormCol75>
    </div>
  );
}
