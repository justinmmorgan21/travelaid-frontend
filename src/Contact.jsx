import { useRef } from "react";
import emailjs from '@emailjs/browser';
import { Button, Textarea, Label, TextInput } from "flowbite-react";
import { HiMail, HiPhone } from "react-icons/hi";
import { useLoaderData } from "react-router-dom";

export function Contact() {
  const current_user = useLoaderData();
  const form = useRef();
  
  const sendEmail = (e) => {
    e.preventDefault();
    emailjs.sendForm(import.meta.env.VITE_APP_SERVICE_ID, import.meta.env.VITE_APP_TEMPLATE_ID, form.current, {
      publicKey: import.meta.env.VITE_APP_PUBLIC_KEY,
    }).then(
      () => {
        e.target.reset();
        alert("Email has been successfully sent!");
      },
      (error) => {
        console.log('FAILED...', error);
      },
    );
  };

  return (
    <div>
      <br />
      <h1 className='text-4xl text-white'>Contact Me</h1>
      <hr className='my-4'/> 
      <form ref={form} className="flex max-w-md flex-col gap-4" onSubmit={(event) => sendEmail(event)}>
        <div>
          <div className="mb-2 block">
            <Label htmlFor="user_name" value="Name" className='text-white'/>
          </div>
          <TextInput id="user_name" name="user_name" type="text" placeholder="your name" defaultValue={localStorage.jwt === undefined ? "" : current_user.name} shadow required />
        </div>
        <div>
          <div className="mb-2 block">
            <Label htmlFor="email" value="Email" className='text-white'/>
          </div>
          <TextInput icon={HiMail} id="email" name="email" type="text" placeholder="email" defaultValue={localStorage.jwt === undefined ? "" : current_user.email} shadow required />
        </div>
        <div className="max-w-md">
          <div className="mb-2 block">
            <Label htmlFor="phone_number" value="Phone Number" className='text-white'/>
          </div>
          <TextInput icon={HiPhone} id="phone_number" name="phone_number" placeholder="555-555-5555" shadow required />
        </div>
        <div className="max-w-md">
          <div className="mb-2 block">
            <Label htmlFor="subject" value="Subject" className='text-white'/>
          </div>
          <TextInput id="subject" name="subject" placeholder="subject" shadow required />
        </div>
        <div>
          <div className="mb-2 block">
            <Label htmlFor="message" value="Message" className='text-white'/>
          </div>
          <Textarea id="message" name="message" placeholder="message" shadow required rows={4} />
        </div>
        <div className=' flex flex-row space-x-2'>
          <Button className="bg-blue-700 px-2 py-0 rounded-md text-white my-6 w-1/2" type="submit">Submit</Button>
          <Button className="bg-blue-700 px-2 py-0 rounded-md text-white my-6 w-1/2" onClick={()=>window.location.href = "/home"}>Cancel</Button>
        </div>
      </form>
    </div>
  );
}