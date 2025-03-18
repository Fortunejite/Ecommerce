import axios from 'axios';

const url = 'https://ecommerce-cenb.onrender.com/';

const reloadWebsite = () => {
  axios
    .get(url)
    .then((res) =>
      console.log(
        `Reloaded at ${new Date().toISOString()}: Status Code ${
          res.status
        }`,
      ),
    )
    .catch((e) => {
      console.error(
        `Error loading at ${new Date().toISOString()}:`,
        e.message,
      );
    });
};

export default reloadWebsite;
