import frappe


# ─────────────────────────────────────────────
#  CCC WEBSITE — PUBLIC API ENDPOINTS
#  All methods are guest-accessible so Frappe
#  Builder Data Scripts can call them without auth.
# ─────────────────────────────────────────────


@frappe.whitelist(allow_guest=True)
def get_services():
    """Return all published services ordered by display_order."""
    return frappe.get_all(
        "CCC Service",
        filters={"is_published": 1},
        fields=["name", "title", "description", "image", "display_order"],
        order_by="display_order asc",
    )


@frappe.whitelist(allow_guest=True)
def get_testimonials():
    """Return all published testimonials."""
    return frappe.get_all(
        "CCC Testimonial",
        filters={"is_published": 1},
        fields=["quote", "author_name", "author_role", "display_order"],
        order_by="display_order asc",
    )


@frappe.whitelist(allow_guest=True)
def get_news():
    """Return all published news articles."""
    return frappe.get_all(
        "CCC News Article",
        filters={"is_published": 1},
        fields=["title", "excerpt", "category", "image", "publish_date", "link_url"],
        order_by="publish_date desc",
        limit=6,
    )


@frappe.whitelist(allow_guest=True)
def get_faqs():
    """Return all published FAQ entries."""
    return frappe.get_all(
        "CCC FAQ",
        filters={"is_published": 1},
        fields=["question", "answer", "display_order"],
        order_by="display_order asc",
    )


@frappe.whitelist(allow_guest=True)
def get_stats():
    """Return all stats for the counter section."""
    return frappe.get_all(
        "CCC Stat",
        fields=["label", "value", "display_order"],
        order_by="display_order asc",
    )


@frappe.whitelist(allow_guest=True)
def get_process_steps():
    """Return process steps ordered by step number."""
    return frappe.get_all(
        "CCC Process Step",
        fields=["title", "description", "image", "step_number"],
        order_by="step_number asc",
    )


@frappe.whitelist(allow_guest=True)
def get_contact_persons():
    """Return all contact persons."""
    return frappe.get_all(
        "CCC Contact Person",
        fields=["department", "description", "icon_class", "contact_info", "display_order"],
        order_by="display_order asc",
    )


@frappe.whitelist(allow_guest=True)
def get_company_settings():
    """Return the single CCC Company Settings document."""
    try:
        doc = frappe.get_single("CCC Company Settings")
        return {
            "phone": doc.phone,
            "email": doc.email,
            "address": doc.address,
            "working_hours": doc.working_hours,
            "hero_tagline": doc.hero_tagline,
            "hero_title": doc.hero_title,
            "hero_subtitle": doc.hero_subtitle,
            "about_text": doc.about_text,
        }
    except Exception:
        return {}


@frappe.whitelist(allow_guest=True)
def submit_contact_form(full_name, email, service, message):
    """
    Create a Lead in ERPNext from the website contact form.
    Called natively via frappe.call() from the frontend.
    """
    name_parts = full_name.strip().split(" ", 1)
    first_name = name_parts[0]
    last_name = name_parts[1] if len(name_parts) > 1 else "—"

    lead = frappe.get_doc({
        "doctype": "Lead",
        "first_name": first_name,
        "last_name": last_name,
        "email_id": email,
        "lead_source": "Website",
        "description": f"Gewünschte Leistung: {service}\n\nNachricht:\n{message}",
    })
    lead.insert(ignore_permissions=True)
    frappe.db.commit()

    return {"status": "ok", "lead": lead.name}
