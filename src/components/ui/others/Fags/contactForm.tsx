import { Input } from "../../forms/Input";
import { Label } from "@radix-ui/react-label";
import { Textarea } from "../../forms/auth/text-area";
import { Button } from "../../Button/Button";


export default function FAgContactForm() {

  return (
    <div className="w-full px-c24">
      <div className="pb-c64">
        <h1 className="font-MontserratBold text-c32 leading-c100p  text-161616">
          Send Us a Message
        </h1>
        <p className="font-MontserratSemiBold text-c18 text-161616 pt-c24">
          Didn't find what you were looking for? Send us message.
        </p>
      </div>
      <form>
        <div className="flex flex-col gap-9">
          <div className="flex gap-c24">
            <div className="flex flex-col gap-3 w-full ">
              <Label className="font-MontserratSemiBold text-c18 text-161616 leading-c100p">
                Full Name
              </Label>
              <Input
                className="font-MontserratSemiBold text-c18 text-646464 leading-c100p"
                placeholder="Enter full name"
              />
            </div>
            <div className="flex flex-col gap-3 w-full ">
              <Label className="font-MontserratSemiBold text-c18 text-161616 leading-c100p">
                Company Name (optional)
              </Label>
              <Input
                className="focus:border-6a0dad font-MontserratSemiBold text-c18 text-646464 leading-c100p"
                placeholder="Enter company name"
              />
            </div>
          </div>
          <div className="flex gap-c24">
            <div className="flex flex-col gap-3 w-full ">
              <Label className="font-MontserratSemiBold text-c18 text-161616 leading-c100p">
                Phone
              </Label>
              <Input
                className="font-MontserratSemiBold text-c18 text-646464 leading-c100p"
                placeholder="Enter phone no"
              />
            </div>
            <div className="flex flex-col gap-3 w-full ">
              <Label className="font-MontserratSemiBold text-c18 text-161616 leading-c100p">
                Email
              </Label>
              <Input
                className="font-MontserratSemiBold text-c18 text-646464 leading-c100p"
                placeholder="Enter email"
              />
            </div>
          </div>
         
          <div className="flex flex-col gap-3 w-full ">
            <Label className="font-MontserratSemiBold text-c18 text-161616 leading-c100p">
              Message
            </Label>
            <Textarea
              className="font-MontserratSemiBold text-c18 text-646464 leading-c100p cursor-pointer h-50"
              placeholder="Write your message..."
            />
          </div>
        </div>
        <Button className="rounded-c50 bg-6a0dad">Send Message</Button>
      </form>
     
    </div>
  );
}
