package lockin.food;

// Run: see README "Check the junk list". Fails loudly if the word lists drift.
public class Check {
    static void yes(java.util.regex.Pattern p, String s) { if (!p.matcher(s).find()) throw new AssertionError("should match: " + s); }
    static void no(java.util.regex.Pattern p, String s) { if (p.matcher(s).find()) throw new AssertionError("should NOT match: " + s); }

    public static void main(String[] a) {
        for (String s : new String[] {"Lay's India's Magic Masala Chips 52 g", "Cadbury Dairy Milk Silk", "Coca-Cola 750 ml",
                "Amul Vanilla Ice Cream", "Kurkure Masala Munch", "Maggi 2-Minute Noodles", "Oreo Cookies", "Thums Up"})
            yes(Guard.JUNK, s);
        for (String s : new String[] {"Amul Toned Milk 500 ml", "Aashirvaad Atta 5 kg", "Onion 1 kg", "Surf Excel",
                "Pancake mix", "Silicone spatula", "Tata Salt", "Fresh Paneer 200 g", "Delivery delayed"})
            no(Guard.JUNK, s);

        for (String s : new String[] {"Proceed To Pay", "Click to Pay ₹245", "Pay ₹245","Place Order", "Proceed to Buy (3 items)", "Checkout"})
            yes(Guard.PAY, s);
        for (String s : new String[] {"View cart", "Add address", "Checkout our offers"}) no(Guard.PAY, s);

        yes(Guard.ADD, "ADD"); yes(Guard.ADD, "Add to cart"); no(Guard.ADD, "Add address");
        yes(Guard.QTY, "1"); yes(Guard.QTY, "12"); no(Guard.QTY, "₹20"); no(Guard.QTY, "52 g"); no(Guard.QTY, "4.2");
        System.out.println("ok");
    }
}
