// src/actions/index.ts
import { ActionError, defineAction } from 'astro:actions';
import { Resend } from 'resend';

const resend = new Resend(import.meta.env.RESEND_API_KEY);

export const server = {
  sendDevis: defineAction({
    accept: 'form',
    handler: async (formData) => {
      const nom = formData.get('Nom') as string;
      const email = formData.get('Email') as string;
      const telephone = (formData.get('Telephone') as string) || 'Non renseigné';
      const message = (formData.get('Message') as string) || 'Aucun message';
      const cartData = formData.get('CartData') as string;

      if (!nom || !email) {
        throw new ActionError({ code: 'BAD_REQUEST', message: 'Nom et Email sont obligatoires.' });
      }

      // Parse the JSON cart data sent from React
      let items = [];
      try {
          items = JSON.parse(cartData);
      } catch (e) {
          items = [];
      }

      // Build the beautiful HTML table rows for the products
      const tableRows = items.map((item: any) => `
        <tr>
            <td style="padding: 12px 15px; border-bottom: 1px solid #eaeaea;">
                <table style="border-collapse: collapse; margin: 0; padding: 0;">
                    <tr>
                        <td style="padding-right: 15px;">
                            <img src="${item.image}" width="45" height="45" style="border-radius: 6px; border: 1px solid #eaeaea; display: block; object-fit: contain; background: #F9F9F9;" alt="Produit" />
                        </td>
                        <td style="font-weight: 700; color: #333333; font-size: 15px; font-family: sans-serif;">
                            ${item.name}
                        </td>
                    </tr>
                </table>
            </td>
            <td style="padding: 12px 15px; border-bottom: 1px solid #eaeaea; color: #666666; font-size: 13px; font-family: sans-serif;">
                ${item.sku}
            </td>
            <td style="padding: 12px 15px; border-bottom: 1px solid #eaeaea; text-align: center; font-family: sans-serif;">
                <span style="background-color: #E86B21; color: white; padding: 4px 10px; border-radius: 6px; font-weight: bold; font-size: 14px;">
                    ${item.qty}
                </span>
            </td>
        </tr>
      `).join('');

      // The full, branded Maxevo HTML Email
      const htmlContent = `
        <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 650px; margin: 0 auto; border: 1px solid #eaeaea; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.05);">
            
            <!-- En-tête Maxevo -->
            <div style="background-color: #13522B; padding: 30px; text-align: center;">
                <h1 style="color: #ffffff; margin: 0; font-size: 26px; font-weight: 900; letter-spacing: 1px;">MAXEVO PACKAGING</h1>
                <p style="color: #a3c4b1; margin: 8px 0 0 0; font-size: 14px; text-transform: uppercase; letter-spacing: 2px;">Nouvelle demande de devis</p>
            </div>
            
            <!-- Corps de l'email -->
            <div style="padding: 35px; background-color: #ffffff;">
                
                <!-- Informations Client -->
                <h2 style="color: #13522B; font-size: 18px; border-bottom: 2px solid #F9F9F9; padding-bottom: 10px; margin-top: 0;">Coordonnées du client</h2>
                <table style="width: 100%; border-collapse: collapse; margin-bottom: 35px; font-size: 15px;">
                    <tr>
                        <td style="padding: 10px 0; border-bottom: 1px solid #f5f5f5; color: #666; width: 130px;"><strong>Entreprise:</strong></td>
                        <td style="padding: 10px 0; border-bottom: 1px solid #f5f5f5; color: #333; font-weight: bold;">${nom}</td>
                    </tr>
                    <tr>
                        <td style="padding: 10px 0; border-bottom: 1px solid #f5f5f5; color: #666;"><strong>Email:</strong></td>
                        <td style="padding: 10px 0; border-bottom: 1px solid #f5f5f5; color: #333;"><a href="mailto:${email}" style="color: #E86B21; text-decoration: none;">${email}</a></td>
                    </tr>
                    <tr>
                        <td style="padding: 10px 0; border-bottom: 1px solid #f5f5f5; color: #666;"><strong>Téléphone:</strong></td>
                        <td style="padding: 10px 0; border-bottom: 1px solid #f5f5f5; color: #333;">${telephone}</td>
                    </tr>
                    <tr>
                        <td style="padding: 10px 0; border-bottom: 1px solid #f5f5f5; color: #666; vertical-align: top;"><strong>Message:</strong></td>
                        <td style="padding: 10px 0; border-bottom: 1px solid #f5f5f5; color: #333; line-height: 1.5;">${message}</td>
                    </tr>
                </table>

                <!-- Tableau des Produits -->
                <h2 style="color: #13522B; font-size: 18px; border-bottom: 2px solid #F9F9F9; padding-bottom: 10px;">Détails de la commande</h2>
                <table style="width: 100%; border-collapse: collapse; margin-top: 15px; border-radius: 8px; overflow: hidden; border: 1px solid #eaeaea;">
                    <thead>
                        <tr style="background-color: #F9F9F9;">
                            <th style="padding: 14px 15px; text-align: left; color: #333; font-size: 13px; text-transform: uppercase; letter-spacing: 1px; border-bottom: 2px solid #eaeaea;">Produit</th>
                            <th style="padding: 14px 15px; text-align: left; color: #333; font-size: 13px; text-transform: uppercase; letter-spacing: 1px; border-bottom: 2px solid #eaeaea;">Réf</th>
                            <th style="padding: 14px 15px; text-align: center; color: #333; font-size: 13px; text-transform: uppercase; letter-spacing: 1px; border-bottom: 2px solid #eaeaea; width: 80px;">Qté</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${tableRows}
                    </tbody>
                </table>
            </div>
            
            <!-- Pied de page -->
            <div style="background-color: #F9F9F9; padding: 20px; text-align: center; border-top: 1px solid #eaeaea;">
                <p style="margin: 0; color: #999999; font-size: 12px;">Ce devis a été généré automatiquement depuis le site web Maxevo Packaging.</p>
            </div>
        </div>
      `;

      // Envoyer l'email
      const { data, error } = await resend.emails.send({
        from: 'Maxevo Packaging <contact@maxevopackaging.ma>',
        to: ['maxevopackaging@gmail.com'],
        subject: `Nouveau devis web - ${nom}`,
        html: htmlContent,
      });

      if (error) {
        throw new ActionError({ code: 'INTERNAL_SERVER_ERROR', message: error.message });
      }

      return data;
    },
  }),
};