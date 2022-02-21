const express = require('express');

// Authentication
const {ensureAuthenticated, isInstructor, isAdmin} = require('../middleware/checkAuth')

// Date
const date = new Date()

// User and Section classes
const User = require('../models/User');
const Section = require('../models/Section');

// Router
const router = express.Router();

const getShifts = (shifts) => {
    const shiftsPerMonth = [];
    const currentMonthYear = `${convertMonth(date.getMonth())} ${date.getFullYear()}`
    if (shifts.length === 0) {
        return 0;
    }

    for (const shift of shifts) {
        const shiftMonth = new Date(shift.date)
        const monthYear = `${convertMonth(shiftMonth.getMonth())} ${shiftMonth.getFullYear()}`
        if (monthYear === currentMonthYear) {
            shiftsPerMonth.push(shift)
        }
    }
    return shiftsPerMonth;
}

const convertMonth = (monthNum) => {
    return [
        'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'
    ][monthNum];
}

router.get('/nda', ensureAuthenticated, (req, res) => {
    req.session.error_message = 'You must accept the NDA to continue.';
    req.session.error_perm = true;

    res.render('nda', {
        page: 'nda',
    });
});

router.post('/nda', ensureAuthenticated, async (req, res) => {
    if (req.body.secret_nda_thing === 'yes-i-actually-used-the-button') {
        await User.update(req.user.id, {
            acceptedNda: true
        });

        req.session.success_message = 'Thanks for accepting the NDA!';
    }

    return res.redirect('/dashboard');
});

router.get('/dashboard', ensureAuthenticated, async (req, res) => {
    res.render('dashboard/dashboard', {
        page: 'dashboard',
    });
});

router.get('/calendar', ensureAuthenticated, (req, res) => {
    res.render('calendar/calendar', {
        page: 'calendar',
    });
});

router.get('/section', isInstructor, async (req, res) => {
    res.render('section/overview', {
        page: 'section',
        students: await User.allInSection(req.user.section.id),
    });
});

router.get('/admin', isAdmin, async (req, res) => {
    res.render('admin/overview', {
        page: 'admin',
        users: await User.all(),
        sections: await Section.all(),
    });
});

router.get('/update/:id', ensureAuthenticated, async (req, res) => {
    const studentId = parseInt(req.params.id)
    const findUser = await User.find(studentId)
    const allShifts = getShifts(findUser.shifts)
    res.render('instructorUpdate/updateStudent', {
        page: 'section',
        student: findUser,
        shifts: allShifts,
    });
})

module.exports = router;
