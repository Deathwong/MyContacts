import express from "express";
import Contact from "../models/Contact.js";

const router = express.Router();

// GET /contacts - Récupérer tous les contacts de l'utilisateur
/**
 * @swagger
 * /contacts:
 *   get:
 *     summary: Retrieve all contacts for the authenticated user
 *     description: Returns a list of all contacts associated with the user's email from their JWT.
 *     tags:
 *       - Contacts
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of user contacts retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 count:
 *                   type: integer
 *                   example: 2
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: 68e4d869ed958d995a116ef3
 *                       firstName:
 *                         type: string
 *                         example: John
 *                       lastName:
 *                         type: string
 *                         example: Doe
 *                       phone:
 *                         type: string
 *                         example: 1234567890
 *                       userEmail:
 *                         type: string
 *                         example: user@example.com
 *                       __v:
 *                         type: integer
 *                         example: 0
 *       401:
 *         description: Unauthorized — missing or invalid JWT token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Non autorisé
 *       500:
 *         description: Internal server error while retrieving contacts
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Error while retrieving contacts
 *                 error:
 *                   type: string
 *                   example: MongoDB connection error
 */
router.get("/contacts", async function (req, res) {
    try {
        const contacts = await Contact.find({ userEmail: req.userEmail });
        res.status(200).json({
            success: true,
            count: contacts.length,
            data: contacts
        });
    } catch (e) {
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la récupération des contacts',
            error: e.message
        });
    }
});

// GET /contacts/:id - Récupérer un contact spécifique
/**
 * @swagger
 * /contacts/{id}:
 *   get:
 *     summary: Retrieve a contact by ID
 *     description: Returns a single contact belonging to the authenticated user by its unique ID.
 *     tags:
 *       - Contacts
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the contact to retrieve
 *     responses:
 *       200:
 *         description: Contact retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: 68e4d869ed958d995a116ef3
 *                     firstName:
 *                       type: string
 *                       example: John
 *                     lastName:
 *                       type: string
 *                       example: Doe
 *                     phone:
 *                       type: string
 *                       example: 1234567890
 *                     userEmail:
 *                       type: string
 *                       example: user@example.com
 *                     __v:
 *                       type: integer
 *                       example: 0
 *       404:
 *         description: Contact not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Contact not found
 *       401:
 *         description: Unauthorized — missing or invalid JWT token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Non autorisé
 *       500:
 *         description: Internal server error while retrieving the contact
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Error while retrieving the contact
 *                 error:
 *                   type: string
 *                   example: MongoDB connection error
 */
router.get("/contacts/:id", async function (req, res) {
    try {
        const contact = await Contact.findOne({
            _id: req.params.id,
            userEmail: req.userEmail
        });

        if (!contact) {
            return res.status(404).json({
                success: false,
                message: 'Contact non trouvé'
            });
        }

        res.status(200).json({
            success: true,
            data: contact
        });

    } catch (e) {
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la récupération du contact',
            error: e.message
        });
    }
});

// POST /contacts - Créer un nouveau contact
/**
 * @swagger
 * /contacts:
 *   post:
 *     summary: Create a new contact
 *     description: Creates a new contact for the authenticated user.
 *     tags:
 *       - Contacts
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstName
 *               - lastName
 *               - phone
 *             properties:
 *               firstName:
 *                 type: string
 *                 example: John
 *               lastName:
 *                 type: string
 *                 example: Doe
 *               phone:
 *                 type: string
 *                 example: 1234567890
 *     responses:
 *       201:
 *         description: Contact created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Contact created successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: 68e4dcaba66e7f6a6c27e14f
 *                     firstName:
 *                       type: string
 *                       example: John
 *                     lastName:
 *                       type: string
 *                       example: Doe
 *                     phone:
 *                       type: string
 *                       example: 1234567890
 *                     userEmail:
 *                       type: string
 *                       example: user@example.com
 *                     __v:
 *                       type: integer
 *                       example: 0
 *       400:
 *         description: Validation error or missing fields
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: All fields are required (firstName, lastName, phone)
 *       401:
 *         description: Unauthorized — missing or invalid JWT token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Non autorisé
 *       500:
 *         description: Internal server error while creating contact
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Error while creating contact
 *                 error:
 *                   type: string
 *                   example: MongoDB connection error
 */
router.post("/contacts", async function (req, res) {
    const { firstName, lastName, phone } = req.body;

    // Validation des champs requis
    if (!firstName || !lastName || !phone) {
        return res.status(400).json({
            success: false,
            message: 'Tous les champs sont requis (firstName, lastName, phone)'
        });
    }

    try {
        const contact = new Contact({
            firstName,
            lastName,
            phone,
            userEmail: req.userEmail
        });

        await contact.save();

        res.status(201).json({
            success: true,
            message: "Contact créé avec succès",
            data: contact
        });
    } catch (e) {
        if (e.name === 'ValidationError') {

            console.log(e);

            return res.status(400).json({
                success: false,
                message: `${e.message}`,
                // message: `Erreur de validation ${e.message}`,
                errors: Object.values(e.errors).map(err => err.message)
            });
        }

        res.status(500).json({
            success: false,
            message: 'Erreur lors de la création du contact',
            error: e.message
        });
    }
});

// PATCH /contacts/:id - Mise à jour partielle d'un contact
/**
 * @swagger
 * /contacts/{id}:
 *   patch:
 *     summary: Update a contact by ID
 *     description: Updates one or more fields (firstName, lastName, phone) of a specific contact belonging to the authenticated user.
 *     tags:
 *       - Contacts
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the contact to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *                 example: Jane
 *               lastName:
 *                 type: string
 *                 example: Smith
 *               phone:
 *                 type: string
 *                 example: 0987654321
 *     responses:
 *       200:
 *         description: Contact successfully updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Contact updated successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: 68e4dcaba66e7f6a6c27e14f
 *                     firstName:
 *                       type: string
 *                       example: Jane
 *                     lastName:
 *                       type: string
 *                       example: Smith
 *                     phone:
 *                       type: string
 *                       example: 0987654321
 *                     userEmail:
 *                       type: string
 *                       example: user@example.com
 *                     __v:
 *                       type: integer
 *                       example: 0
 *       400:
 *         description: Validation error or invalid phone number
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: The phone number must contain between 10 and 20 characters
 *       404:
 *         description: Contact not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Contact not found
 *       401:
 *         description: Unauthorized — missing or invalid JWT token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Non autorisé
 *       500:
 *         description: Internal server error while updating contact
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Error while updating contact
 *                 error:
 *                   type: string
 *                   example: MongoDB connection error
 */
router.patch("/contacts/:id", async function (req, res) {
    try {
        const { firstName, lastName, phone } = req.body;
        const updateData = {};

        // Ne mettre à jour que les champs fournis
        if (firstName) updateData.firstName = firstName;
        if (lastName) updateData.lastName = lastName;
        if (phone) {
            // Validation du téléphone
            if (phone.length < 10 || phone.length > 20) {
                return res.status(400).json({
                    success: false,
                    message: 'Le numéro de téléphone doit contenir entre 10 et 20 caractères'
                });
            }
            updateData.phone = phone;
        }

        const contact = await Contact.findOneAndUpdate(
            { _id: req.params.id, userEmail: req.userEmail },
            updateData,
            { new: true, runValidators: true }
        );

        if (!contact) {
            return res.status(404).json({
                success: false,
                message: 'Contact non trouvé'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Contact mis à jour avec succès',
            data: contact
        });
    } catch (e) {
        if (e.name === 'ValidationError') {
            return res.status(400).json({
                success: false,
                message: 'Erreur de validation',
                errors: Object.values(e.errors).map(err => err.message)
            });
        }

        res.status(500).json({
            success: false,
            message: 'Erreur lors de la mise à jour du contact',
            error: e.message
        });
    }
});

// DELETE /contacts/:id - Supprimer un contact
/**
 * @swagger
 * /contacts/{id}:
 *   delete:
 *     summary: Delete a contact by ID
 *     description: Deletes a specific contact belonging to the authenticated user by its unique ID.
 *     tags:
 *       - Contacts
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the contact to delete
 *     responses:
 *       200:
 *         description: Contact successfully deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Contact deleted successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: 68e4dcaba66e7f6a6c27e14f
 *                     firstName:
 *                       type: string
 *                       example: John
 *                     lastName:
 *                       type: string
 *                       example: Doe
 *                     phone:
 *                       type: string
 *                       example: 1234567890
 *                     userEmail:
 *                       type: string
 *                       example: user@example.com
 *                     __v:
 *                       type: integer
 *                       example: 0
 *       404:
 *         description: Contact not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Contact not found
 *       401:
 *         description: Unauthorized — missing or invalid JWT token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Non autorisé
 *       500:
 *         description: Internal server error while deleting contact
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Error while deleting contact
 *                 error:
 *                   type: string
 *                   example: MongoDB connection error
 */
router.delete("/contacts/:id", async function (req, res) {
    try {
        const contact = await Contact.findOneAndDelete({
            _id: req.params.id,
            userEmail: req.userEmail
        });

        if (!contact) {
            return res.status(404).json({
                success: false,
                message: 'Contact non trouvé'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Contact supprimé avec succès',
            data: contact
        });
    } catch (e) {
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la suppression du contact',
            error: e.message
        });
    }
});

export default router;