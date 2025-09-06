const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 3000;
const DATA_FILE = path.join(__dirname, 'data.json');

// Middleware
app.use(cors());
app.use(express.json());

// data.json dosyasını oku
async function readData() {
    try {
        const data = await fs.readFile(DATA_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        // Dosya yoksa boş veri döndür
        return {
            customers: [],
            works: [],
            payments: [],
            lastUpdated: new Date().toISOString()
        };
    }
}

// data.json dosyasına yaz
async function writeData(data) {
    try {
        data.lastUpdated = new Date().toISOString();
        await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
        return true;
    } catch (error) {
        console.error('Dosya yazma hatası:', error);
        return false;
    }
}

// Tüm verileri getir
app.get('/api/data', async (req, res) => {
    try {
        const data = await readData();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Veri okunamadı' });
    }
});

// Verileri güncelle
app.post('/api/data', async (req, res) => {
    try {
        const success = await writeData(req.body);
        if (success) {
            res.json({ message: 'Veriler başarıyla kaydedildi' });
        } else {
            res.status(500).json({ error: 'Veriler kaydedilemedi' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Veri kaydetme hatası' });
    }
});

// Müşteri ekle
app.post('/api/customers', async (req, res) => {
    try {
        const data = await readData();
        const newCustomer = {
            id: Date.now(),
            ...req.body,
            createdAt: new Date().toISOString()
        };
        data.customers.push(newCustomer);
        
        const success = await writeData(data);
        if (success) {
            res.json(newCustomer);
        } else {
            res.status(500).json({ error: 'Müşteri kaydedilemedi' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Müşteri ekleme hatası' });
    }
});

// İşlem ekle
app.post('/api/works', async (req, res) => {
    try {
        const data = await readData();
        const newWork = {
            id: Date.now(),
            ...req.body,
            createdAt: new Date().toISOString()
        };
        data.works.push(newWork);
        
        const success = await writeData(data);
        if (success) {
            res.json(newWork);
        } else {
            res.status(500).json({ error: 'İşlem kaydedilemedi' });
        }
    } catch (error) {
        res.status(500).json({ error: 'İşlem ekleme hatası' });
    }
});

// Ödeme ekle
app.post('/api/payments', async (req, res) => {
    try {
        const data = await readData();
        const newPayment = {
            id: Date.now(),
            ...req.body,
            createdAt: new Date().toISOString()
        };
        data.payments.push(newPayment);
        
        const success = await writeData(data);
        if (success) {
            res.json(newPayment);
        } else {
            res.status(500).json({ error: 'Ödeme kaydedilemedi' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Ödeme ekleme hatası' });
    }
});

// İşlem sil
app.delete('/api/works/:id', async (req, res) => {
    try {
        const data = await readData();
        const workId = parseInt(req.params.id);
        data.works = data.works.filter(work => work.id !== workId);
        
        const success = await writeData(data);
        if (success) {
            res.json({ message: 'İşlem silindi' });
        } else {
            res.status(500).json({ error: 'İşlem silinemedi' });
        }
    } catch (error) {
        res.status(500).json({ error: 'İşlem silme hatası' });
    }
});

// Müşteri sil
app.delete('/api/customers/:id', async (req, res) => {
    try {
        const data = await readData();
        const customerId = parseInt(req.params.id);
        
        // Müşteriyi sil
        data.customers = data.customers.filter(customer => customer.id !== customerId);
        
        // Müşteriye ait işlemleri sil
        data.works = data.works.filter(work => work.customerId !== customerId);
        
        // Müşteriye ait ödemeleri sil
        data.payments = data.payments.filter(payment => payment.customerId !== customerId);
        
        const success = await writeData(data);
        if (success) {
            res.json({ message: 'Müşteri ve ilgili veriler silindi' });
        } else {
            res.status(500).json({ error: 'Müşteri silinemedi' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Müşteri silme hatası' });
    }
});

// Tüm verileri temizle
app.delete('/api/data', async (req, res) => {
    try {
        const emptyData = {
            customers: [],
            works: [],
            payments: [],
            lastUpdated: new Date().toISOString()
        };
        
        const success = await writeData(emptyData);
        if (success) {
            res.json({ message: 'Tüm veriler temizlendi' });
        } else {
            res.status(500).json({ error: 'Veriler temizlenemedi' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Veri temizleme hatası' });
    }
});

// Static dosyaları serve et
app.use(express.static(__dirname));

app.listen(PORT, () => {
    console.log(`🚀 Mercury API servisi http://localhost:${PORT} adresinde çalışıyor`);
    console.log(`📁 data.json dosyası: ${DATA_FILE}`);
});
