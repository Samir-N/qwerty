import Logo from '../assets/images/logo.png';
import icons from '../util/icons'; // Assuming this has your social icons

const Footer = () => {
  return (
    <footer className="bg-[#0B0F19] text-white">
      <div className=" px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-20 mg:gap-50">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <img src={Logo} alt="Smart Tutor" className="h-16 w-16" />
            <h2 className=" font-semibold">Smart Tutor</h2>
          </div>
          <p className="text-gray-300 text-[20px]">
            Connecting students with expert tutors for personalized learning experiences. Transform your education journey with Smart Tutor.
          </p>
    
          <div className="flex gap-4 mt-4">
            
              <a href="#">
                <icons.facebook size={40} />
              </a>


               <a href="#">
                <icons.linkedin size={40} />
              </a>


               <a href="#">
                <icons.instagram size={40} />
              </a>

               <a href="#">
                <icons.twitter size={40} />
              </a>
          </div>
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-4">Quick Links</h3>
          <ul className="space-y-2 text-gray-300 text-sm">
            <li><a href="#" className="hover:text-white">Home</a></li>
            <li><a href="#" className="hover:text-white">About</a></li>
            <li><a href="#" className="hover:text-white">Pricing</a></li>
            <li><a href="#" className="hover:text-white">About Us</a></li>
            <li><a href="#" className="hover:text-white">Contact</a></li>
          </ul>
        </div>

        {/* Support Links */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Support</h3>
          <ul className="space-y-2 text-gray-300 text-sm">
            <li><a href="#" className="hover:text-white">Help Center</a></li>
            <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
            <li><a href="#" className="hover:text-white">Terms of Service</a></li>
            <li><a href="#" className="hover:text-white">Cookie Policy</a></li>
            <li><a href="#" className="hover:text-white">Refund Policy</a></li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-700 mt-8 py-4 text-center text-sm text-gray-400">
        <p>© 2025 Smart Tutor. All rights reserved.</p>
        <div className="flex justify-center gap-6 mt-2">
          <a href="#" className="hover:text-white">Privacy</a>
          <a href="#" className="hover:text-white">Terms</a>
          <a href="#" className="hover:text-white">Cookies</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
