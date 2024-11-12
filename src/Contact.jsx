import { useRef } from "react";
import emailjs from '@emailjs/browser';
import { Button, Textarea, Label, TextInput } from "flowbite-react";
import { AiFillEnvironment } from "react-icons/ai";
import { useLoaderData } from "react-router-dom";
// import PhoneInput from "react-phone-number-input";
// import 'react-phone-number-input/style.css'

export function Contact() {
  const current_user = useLoaderData();
  // const [phoneNumber, setPhoneNumber] = useState("");
  const form = useRef();
  
  const sendEmail = (e) => {
    e.preventDefault();

    emailjs
      .sendForm(import.meta.env.VITE_APP_SERVICE_ID, import.meta.env.VITE_APP_TEMPLATE_ID, form.current, {
        publicKey: import.meta.env.VITE_APP_PUBLIC_KEY,
      })
      .then(
        () => {
          console.log('SUCCESS!');
          e.target.reset();
          alert("Email has been successfully sent!");
        },
        (error) => {
          console.log('FAILED...', error.text);
        },
      );
  };

  return (
    <div>
      <h1 className='text-2xl'>Contact Me</h1>
      <hr className='my-4'/> 
      <form className="flex max-w-md flex-col gap-4" onSubmit={(event) => sendEmail(event)}>
        <div>
          <div className="mb-2 block">
            <Label htmlFor="user_name" value="Name" />
          </div>
          <TextInput id="user_name" name="user_name" type="text" placeholder="your name" defaultValue={current_user.name} shadow required />
        </div>
        <div>
          <div className="mb-2 block">
            <Label htmlFor="email" value="Email" />
          </div>
          <TextInput icon={AiFillEnvironment} id="email" name="email" type="text" placeholder="email" defaultValue={current_user.email} shadow required />
        </div>
        <div className="max-w-md">
          <div className="mb-2 block">
            <Label htmlFor="phone_number" value="Phone Number" />
          </div>
          <TextInput id="phone_number" name="phone_number" placeholder="555-555-5555" shadow required />
        </div>
        <div className="max-w-md">
          <div className="mb-2 block">
            <Label htmlFor="subject" value="Subject" />
          </div>
          <TextInput id="subject" name="subject" placeholder="subject" shadow required />
        </div>
        <div>
          <div className="mb-2 block">
            <Label htmlFor="message" value="Message" />
          </div>
          <Textarea id="message" name="message" placeholder="message" shadow required rows={4} />
        </div>
        <div className=' flex flex-row space-x-2'>
          <Button className="bg-blue-500 px-2 py-0 rounded-md text-white my-12 w-1/2" type="submit">Submit</Button>
          {/* <Button className="w-1/2" onClick={()=>onClose()}>Cancel</Button> */}
        </div>
      </form>
    </div>
  );
          // {/* <PhoneInput 
          //   type="text" 
          //   name="phone_number"
          //   defaultCountry="US"
          //   value={phoneNumber}
          //   onChange={setPhoneNumber} 
          //   placeholder="Phone Number" 
          //   required
          // /> */}

}